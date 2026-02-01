#!/usr/bin/env node
/**
 * Redis缓存功能测试脚本
 */

const https = require('https');

const config = {
    baseUrl: 'https://xx.aieo.cn',
    testCases: [
        {
            name: '门店列表缓存测试',
            path: '/api/stores',
            description: '测试门店列表的Redis缓存功能'
        },
        {
            name: '单个门店缓存测试',
            path: '/api/stores/1',
            description: '测试单个门店信息的Redis缓存功能'
        },
        {
            name: '房间列表缓存测试',
            path: '/api/rooms/store/1',
            description: '测试房间列表的Redis缓存功能'
        }
    ]
};

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const options = {
            hostname: 'xx.aieo.cn',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        responseTime: responseTime,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        responseTime: responseTime,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function testCachePerformance(testCase) {
    console.log(`\n🧪 ${testCase.name}`);
    console.log(`📝 ${testCase.description}`);
    console.log(`🔗 ${config.baseUrl}${testCase.path}`);
    
    try {
        // 第一次请求 - 从数据库查询
        console.log('\n📊 第一次请求（从数据库）:');
        const firstResponse = await makeRequest(testCase.path);
        console.log(`   ⏱️  响应时间: ${firstResponse.responseTime}ms`);
        console.log(`   📊 状态码: ${firstResponse.statusCode}`);
        
        if (firstResponse.statusCode === 200) {
            console.log(`   ✅ 请求成功`);
            
            // 等待1秒，确保缓存生效
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 第二次请求 - 从Redis缓存
            console.log('\n📊 第二次请求（从Redis缓存）:');
            const secondResponse = await makeRequest(testCase.path);
            console.log(`   ⏱️  响应时间: ${secondResponse.responseTime}ms`);
            console.log(`   📊 状态码: ${secondResponse.statusCode}`);
            
            if (secondResponse.statusCode === 200) {
                console.log(`   ✅ 请求成功`);
                
                // 计算性能提升
                const improvement = ((firstResponse.responseTime - secondResponse.responseTime) / firstResponse.responseTime * 100).toFixed(1);
                console.log(`\n🚀 缓存性能分析:`);
                console.log(`   📈 性能提升: ${improvement}%`);
                console.log(`   ⚡ 缓存效果: ${improvement > 0 ? '有效' : '无明显提升'}`);
                
                // 验证数据一致性
                if (JSON.stringify(firstResponse.data) === JSON.stringify(secondResponse.data)) {
                    console.log(`   ✅ 数据一致性: 通过`);
                } else {
                    console.log(`   ❌ 数据一致性: 失败`);
                }
            } else {
                console.log(`   ❌ 第二次请求失败: ${secondResponse.statusCode}`);
            }
        } else {
            console.log(`   ❌ 第一次请求失败: ${firstResponse.statusCode}`);
            if (firstResponse.data) {
                console.log(`   📄 错误信息: ${JSON.stringify(firstResponse.data, null, 2)}`);
            }
        }
        
    } catch (error) {
        console.log(`   ❌ 测试失败: ${error.message}`);
    }
}

async function testRedisConnection() {
    console.log('🔧 测试Redis连接状态...');
    
    try {
        // 测试一个简单的API来验证服务是否正常
        const response = await makeRequest('/api/stores');
        if (response.statusCode === 200) {
            console.log('✅ 后端服务连接正常');
            return true;
        } else {
            console.log(`❌ 后端服务异常: ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ 连接失败: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('==========================================');
    console.log('🔥 Redis缓存功能测试');
    console.log('==========================================');
    console.log(`🌐 测试环境: ${config.baseUrl}`);
    console.log(`📅 测试时间: ${new Date().toLocaleString()}`);
    
    // 测试连接
    const isConnected = await testRedisConnection();
    if (!isConnected) {
        console.log('\n❌ 无法连接到后端服务，测试终止');
        return;
    }
    
    // 执行缓存测试
    for (const testCase of config.testCases) {
        await testCachePerformance(testCase);
        
        // 测试间隔
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n==========================================');
    console.log('📊 Redis缓存测试完成');
    console.log('==========================================');
    console.log('\n💡 缓存策略说明:');
    console.log('   🔸 门店和房间数据缓存10分钟');
    console.log('   🔸 查询操作使用缓存提高性能');
    console.log('   🔸 增删改操作自动清除缓存');
    console.log('   🔸 管理后台数据不缓存保证实时性');
}

// 运行测试
main().catch(console.error);