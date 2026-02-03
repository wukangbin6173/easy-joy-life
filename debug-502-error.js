#!/usr/bin/env node
/**
 * 502错误诊断脚本
 */

const https = require('https');
const http = require('http');

const config = {
    domain: 'xx.aieo.cn',
    endpoints: [
        '/api/stores',
        '/api/stores/1',
        '/api/test'
    ]
};

function testEndpoint(endpoint, useHttps = true) {
    return new Promise((resolve) => {
        const protocol = useHttps ? https : http;
        const port = useHttps ? 443 : 80;
        
        const options = {
            hostname: config.domain,
            port: port,
            path: endpoint,
            method: 'GET',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; API-Test/1.0)',
                'Accept': 'application/json'
            }
        };

        const startTime = Date.now();
        
        const req = protocol.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const endTime = Date.now();
                resolve({
                    endpoint,
                    protocol: useHttps ? 'HTTPS' : 'HTTP',
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers,
                    responseTime: endTime - startTime,
                    data: data.substring(0, 200),
                    success: res.statusCode >= 200 && res.statusCode < 300
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                endpoint,
                protocol: useHttps ? 'HTTPS' : 'HTTP',
                error: err.message,
                success: false
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                endpoint,
                protocol: useHttps ? 'HTTPS' : 'HTTP',
                error: 'Request timeout',
                success: false
            });
        });

        req.end();
    });
}

async function main() {
    console.log('==========================================');
    console.log('🔍 502错误诊断');
    console.log('==========================================');
    console.log(`🌐 测试域名: ${config.domain}`);
    console.log(`📅 测试时间: ${new Date().toLocaleString()}`);
    
    console.log('\n📋 测试HTTPS连接...');
    for (const endpoint of config.endpoints) {
        const result = await testEndpoint(endpoint, true);
        
        console.log(`\n🔗 ${result.protocol} ${endpoint}`);
        if (result.success) {
            console.log(`   ✅ 状态: ${result.statusCode} ${result.statusMessage || ''}`);
            console.log(`   ⏱️  响应时间: ${result.responseTime}ms`);
            console.log(`   📄 响应预览: ${result.data}`);
        } else {
            console.log(`   ❌ 错误: ${result.error || `${result.statusCode} ${result.statusMessage}`}`);
            if (result.statusCode === 502) {
                console.log(`   🔧 502错误 - 可能的原因:`);
                console.log(`      - 后端服务未启动`);
                console.log(`      - Nginx配置错误`);
                console.log(`      - 端口转发问题`);
            }
        }
    }
    
    console.log('\n📋 测试HTTP连接...');
    for (const endpoint of config.endpoints) {
        const result = await testEndpoint(endpoint, false);
        
        console.log(`\n🔗 ${result.protocol} ${endpoint}`);
        if (result.success) {
            console.log(`   ✅ 状态: ${result.statusCode} ${result.statusMessage || ''}`);
            console.log(`   ⏱️  响应时间: ${result.responseTime}ms`);
        } else {
            console.log(`   ❌ 错误: ${result.error || `${result.statusCode} ${result.statusMessage}`}`);
        }
    }
    
    console.log('\n==========================================');
    console.log('🏁 诊断完成');
    console.log('==========================================');
}

main().catch(console.error);