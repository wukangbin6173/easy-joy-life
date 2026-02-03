#!/bin/bash

echo "🚀 修复微信JSAPI支付并重新部署..."

# 检查是否在项目根目录
if [ ! -f "backend/pom.xml" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 进入后端目录
cd backend

echo "📦 清理旧的编译文件..."
./mvnw clean

echo "🔧 重新编译项目..."
./mvnw compile

echo "📋 检查编译结果..."
if [ $? -eq 0 ]; then
    echo "✅ 编译成功"
else
    echo "❌ 编译失败，请检查错误信息"
    exit 1
fi

echo "🏗️ 打包应用..."
./mvnw package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ 打包成功"
else
    echo "❌ 打包失败，请检查错误信息"
    exit 1
fi

echo "🔄 停止现有服务..."
# 查找并停止Java进程
JAVA_PID=$(ps aux | grep 'easy-joy-life-system' | grep -v grep | awk '{print $2}')
if [ ! -z "$JAVA_PID" ]; then
    echo "停止进程 PID: $JAVA_PID"
    kill -9 $JAVA_PID
    sleep 3
fi

echo "🚀 启动新服务..."
# 后台启动服务
nohup java -jar target/easy-joy-life-system-1.0.0.jar > ../logs/app.log 2>&1 &

echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
curl -s http://localhost:8080/actuator/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ 服务启动成功"
else
    echo "⚠️ 服务可能还在启动中，请稍后检查"
fi

echo "📋 查看最新日志..."
tail -n 20 ../logs/app.log

echo ""
echo "🎉 微信JSAPI支付修复部署完成！"
echo ""
echo "📝 修复内容:"
echo "- 更新微信支付SDK到0.2.18版本"
echo "- 修复total_fee参数错误"
echo "- 增强参数验证和错误处理"
echo "- 添加详细的日志输出"
echo ""
echo "🔧 测试命令:"
echo "node ../test-wechat-jsapi-fix.js"
echo ""
echo "📊 查看日志:"
echo "tail -f ../logs/app.log"