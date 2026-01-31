# 微信支付公钥模式部署脚本 - 服务器编译版本
# 解决本地Java版本兼容性问题，在服务器上编译

param(
    [string]$ServerHost = "xx.aieo.cn",
    [string]$ServerUser = "root"
)

# 颜色输出函数
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

Write-Host "🚀 微信支付公钥模式部署开始..." -ForegroundColor Cyan
Write-Host "📅 部署时间: $(Get-Date)" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# 步骤1: 检查SSH连接
Write-Info "检查SSH连接..."
$sshTest = ssh -o ConnectTimeout=10 -o BatchMode=yes $ServerUser@$ServerHost "echo 'SSH连接成功'" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "SSH连接正常"
} else {
    Write-Error "SSH连接失败，请检查网络和SSH密钥配置"
    exit 1
}

# 步骤2: 强制停止服务
Write-Info "强制停止现有服务..."
ssh $ServerUser@$ServerHost @"
echo '🔍 查找并停止Java进程...'

# 查找Java进程
JAVA_PIDS=`$(ps aux | grep java | grep -v grep | awk '{print `$2}')

if [ ! -z "`$JAVA_PIDS" ]; then
    echo "发现Java进程: `$JAVA_PIDS"
    echo "强制终止Java进程..."
    echo `$JAVA_PIDS | xargs kill -9 2>/dev/null || true
    sleep 2
else
    echo "未发现Java进程"
fi

# 检查端口占用并强制释放
echo '🔍 检查端口占用...'

# 检查8081端口
PORT_8081_PID=`$(lsof -ti:8081 2>/dev/null || true)
if [ ! -z "`$PORT_8081_PID" ]; then
    echo "端口8081被进程 `$PORT_8081_PID 占用，强制终止..."
    kill -9 `$PORT_8081_PID 2>/dev/null || true
fi

# 检查80端口
PORT_80_PID=`$(lsof -ti:80 2>/dev/null || true)
if [ ! -z "`$PORT_80_PID" ]; then
    echo "端口80被进程 `$PORT_80_PID 占用，强制终止..."
    kill -9 `$PORT_80_PID 2>/dev/null || true
fi

# 停止可能的systemd服务
systemctl stop nginx 2>/dev/null || true

echo '✅ 服务停止完成'
sleep 3

# 再次检查端口
if lsof -ti:8081 >/dev/null 2>&1; then
    echo '⚠️  端口8081仍被占用'
else
    echo '✅ 端口8081已释放'
fi

if lsof -ti:80 >/dev/null 2>&1; then
    echo '⚠️  端口80仍被占用'
else
    echo '✅ 端口80已释放'
fi
"@

if ($LASTEXITCODE -eq 0) {
    Write-Success "服务停止完成"
} else {
    Write-Error "服务停止失败"
    exit 1
}

# 步骤3: 上传代码到服务器
Write-Info "上传代码到服务器..."

# 创建临时目录
$tempDir = "/tmp/easyjoylife-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
ssh $ServerUser@$ServerHost "mkdir -p $tempDir"

# 上传后端代码
Write-Info "上传后端代码..."
scp -r backend/* $ServerUser@$ServerHost`:$tempDir/backend/
if ($LASTEXITCODE -ne 0) {
    Write-Error "后端代码上传失败"
    exit 1
}

# 上传前端代码
Write-Info "上传前端代码..."
scp -r miniprogram/* $ServerUser@$ServerHost`:$tempDir/miniprogram/
if ($LASTEXITCODE -ne 0) {
    Write-Error "前端代码上传失败"
    exit 1
}

Write-Success "代码上传完成"

# 步骤4: 在服务器上编译
Write-Info "在服务器上编译后端..."
ssh $ServerUser@$ServerHost @"
cd $tempDir/backend

echo '🔍 检查Java环境...'
java -version
echo '🔍 检查Maven环境...'
mvn -version

echo '🔨 开始Maven编译...'
mvn clean package -DskipTests -q

if [ `$? -eq 0 ]; then
    echo '✅ Maven编译成功'
    ls -la target/
else
    echo '❌ Maven编译失败'
    exit 1
fi
"@

if ($LASTEXITCODE -ne 0) {
    Write-Error "服务器编译失败"
    exit 1
}

Write-Success "服务器编译完成"

# 步骤5: 部署文件
Write-Info "部署文件到目标目录..."
ssh $ServerUser@$ServerHost @"
# 确保目标目录存在
mkdir -p /opt/easyjoylife
mkdir -p /var/www/html

# 备份旧文件
if [ -f /opt/easyjoylife/easy-joy-life-system-1.0.0.jar ]; then
    mv /opt/easyjoylife/easy-joy-life-system-1.0.0.jar /opt/easyjoylife/easy-joy-life-system-1.0.0.jar.backup.`$(date +%Y%m%d_%H%M%S)
    echo '✅ 旧JAR文件已备份'
fi

# 复制新文件
cp $tempDir/backend/target/easy-joy-life-system-1.0.0.jar /opt/easyjoylife/
cp -r $tempDir/miniprogram/* /var/www/html/

# 设置权限
chown -R root:root /opt/easyjoylife/
chown -R www-data:www-data /var/www/html/
chmod +x /opt/easyjoylife/easy-joy-life-system-1.0.0.jar

echo '✅ 文件部署完成'

# 清理临时目录
rm -rf $tempDir
echo '✅ 临时文件清理完成'
"@

if ($LASTEXITCODE -ne 0) {
    Write-Error "文件部署失败"
    exit 1
}

Write-Success "文件部署完成"

# 步骤6: 启动服务
Write-Info "启动服务..."
ssh $ServerUser@$ServerHost @"
cd /opt/easyjoylife

echo '🚀 启动后端服务...'

# 设置Java环境变量
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=`$JAVA_HOME/bin:`$PATH

# 启动后端服务
nohup java -jar -Dserver.port=8081 \
    -Dspring.profiles.active=prod \
    -Xms512m -Xmx1024m \
    easy-joy-life-system-1.0.0.jar > app.log 2>&1 &

echo '等待后端服务启动...'
sleep 15

# 检查后端服务状态
if lsof -ti:8081 >/dev/null 2>&1; then
    echo '✅ 后端服务启动成功 (端口8081)'
else
    echo '❌ 后端服务启动失败'
    echo '最近的日志:'
    tail -20 app.log
    exit 1
fi

echo '🌐 启动Nginx...'
systemctl start nginx

if systemctl is-active --quiet nginx; then
    echo '✅ Nginx启动成功'
else
    echo '❌ Nginx启动失败'
    systemctl status nginx
    exit 1
fi

echo '🔍 检查服务状态...'
echo '后端服务 (8081端口):'
lsof -ti:8081 && echo '✅ 运行中' || echo '❌ 未运行'

echo '前端服务 (80端口):'
lsof -ti:80 && echo '✅ 运行中' || echo '❌ 未运行'

echo '📊 系统资源使用情况:'
free -h
df -h /

echo '📋 微信支付服务初始化日志:'
grep -A 10 -B 5 '微信支付' app.log | tail -20
"@

if ($LASTEXITCODE -ne 0) {
    Write-Error "服务启动失败"
    exit 1
}

Write-Success "服务启动完成"

# 步骤7: 验证部署
Write-Info "验证部署结果..."

Start-Sleep -Seconds 5

# 测试后端API
Write-Info "测试后端API..."
try {
    $response = Invoke-WebRequest -Uri "http://$ServerHost`:8081/api/test" -TimeoutSec 10 -ErrorAction Stop
    Write-Success "后端API响应正常"
} catch {
    Write-Warning "后端API测试失败，可能需要时间启动"
}

# 测试前端
Write-Info "测试前端访问..."
try {
    $response = Invoke-WebRequest -Uri "http://$ServerHost/" -TimeoutSec 10 -ErrorAction Stop
    Write-Success "前端访问正常"
} catch {
    Write-Warning "前端访问测试失败"
}

# 测试微信支付配置
Write-Info "测试微信支付配置..."
node test-wechat-pay-config.js

Write-Host "===========================================" -ForegroundColor Cyan
Write-Success "🎉 部署完成！"
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "📱 小程序访问: https://$ServerHost/" -ForegroundColor Yellow
Write-Host "🔧 后端API: https://$ServerHost`:8081/" -ForegroundColor Yellow
Write-Host "📋 管理后台: https://$ServerHost/admin.html" -ForegroundColor Yellow
Write-Host "" 
Write-Info "💡 微信支付公钥模式已启用，应该解决了平台证书过期问题"
Write-Host "===========================================" -ForegroundColor Cyan