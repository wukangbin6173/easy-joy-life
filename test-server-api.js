// 测试服务器API接口
const https = require('https');
const http = require('http');

// 测试配置
const SERVER_HOST = 'xx.aieo.cn';
const API_BASE = `https://${SERVER_HOST}/api`;

// 测试函数
async function testAPI(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE}${path}`;
        console.log(`\n🔍 测试: ${method} ${url}`);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'EasyJoyLife-Test/1.0'
            }
        };
        
        const req = https.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    console.log(`✅ 状态码: ${res.statusCode}`);
                    console.log(`📄 响应: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    console.log(`✅ 状态码: ${res.statusCode}`);
                    console.log(`📄 响应: ${responseData.substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ 错误: ${error.message}`);
            reject(error);
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// 主测试函数
async function runTests() {
    console.log('🚀 开始测试 EasyJoyLife API 接口');
    console.log('='.repeat(50));
    
    try {
        // 1. 测试门店列表接口
        await testAPI('/stores');
        
        // 2. 测试房间列表接口
        await testAPI('/rooms');
        
        // 3. 测试微信登录接口 (会失败，但能看到是否到达了接口)
        await testAPI('/auth/wechat/login', 'POST', { code: 'test_code_123' });
        
        // 4. 测试微信测试接口
        await testAPI('/auth/wechat/test', 'POST', { code: 'test_code_123' });
        
        console.log('\n🎉 API测试完成!');
        console.log('\n📊 测试总结:');
        console.log('- 如果门店和房间接口返回200，说明服务正常运行');
        console.log('- 如果微信登录接口返回400/401，说明接口可达，只是参数问题');
        console.log('- 如果返回404，说明路由配置有问题');
        console.log('- 如果连接超时，说明服务未启动或网络问题');
        
    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error.message);
    }
}

// 运行测试
runTests();