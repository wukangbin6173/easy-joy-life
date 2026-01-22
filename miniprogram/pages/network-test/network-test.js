// pages/network-test/network-test.js
const app = getApp();

Page({
  data: {
    testResults: [],
    isTesting: false
  },

  onLoad() {
    this.addResult('页面加载完成');
    this.addResult(`当前配置: ${app.globalData.baseUrl}`);
    this.addResult(`模拟模式: ${app.globalData.mockMode}`);
  },

  // 添加测试结果
  addResult(message) {
    const results = this.data.testResults;
    results.push({
      time: new Date().toLocaleTimeString(),
      message: message
    });
    this.setData({
      testResults: results
    });
  },

  // 测试基础网络连接
  testBasicNetwork() {
    this.addResult('开始测试基础网络连接...');
    
    wx.request({
      url: 'https://www.baidu.com',
      method: 'GET',
      success: (res) => {
        this.addResult('✅ 基础网络连接正常');
      },
      fail: (err) => {
        this.addResult('❌ 基础网络连接失败: ' + err.errMsg);
      }
    });
  },

  // 测试后端API连接
  testBackendAPI() {
    this.addResult('开始测试后端API连接...');
    
    const apiUrl = app.globalData.baseUrl + '/api/stores';
    this.addResult(`测试地址: ${apiUrl}`);
    
    wx.request({
      url: apiUrl,
      method: 'GET',
      success: (res) => {
        this.addResult('✅ 后端API连接成功');
        this.addResult(`状态码: ${res.statusCode}`);
        this.addResult(`响应数据: ${JSON.stringify(res.data).substring(0, 100)}...`);
        
        if (res.data && res.data.code === 200) {
          this.addResult(`✅ 获取到 ${res.data.data.length} 个门店`);
        } else {
          this.addResult('⚠️ API返回异常: ' + (res.data?.message || '未知错误'));
        }
      },
      fail: (err) => {
        this.addResult('❌ 后端API连接失败');
        this.addResult(`错误信息: ${err.errMsg}`);
        this.addResult(`状态码: ${err.statusCode || '无'}`);
        
        // 详细错误分析
        if (err.errMsg.includes('timeout')) {
          this.addResult('💡 建议: 请求超时，检查网络或服务器状态');
        } else if (err.errMsg.includes('fail')) {
          this.addResult('💡 建议: 连接失败，检查IP地址和端口');
        } else if (err.errMsg.includes('domain')) {
          this.addResult('💡 建议: 域名问题，确认微信开发者工具设置');
        }
      }
    });
  },

  // 测试不同IP地址
  testDifferentIPs() {
    this.addResult('开始测试不同IP地址...');
    
    const ips = [
      'http://localhost:8080',
      'http://127.0.0.1:8080', 
      'http://192.168.110.28:8080'
    ];
    
    ips.forEach((ip, index) => {
      setTimeout(() => {
        this.addResult(`测试 ${ip}...`);
        wx.request({
          url: ip + '/api/stores',
          method: 'GET',
          timeout: 5000,
          success: (res) => {
            this.addResult(`✅ ${ip} 连接成功`);
          },
          fail: (err) => {
            this.addResult(`❌ ${ip} 连接失败: ${err.errMsg}`);
          }
        });
      }, index * 1000);
    });
  },

  // 运行完整测试
  runFullTest() {
    this.setData({
      isTesting: true,
      testResults: []
    });
    
    this.addResult('=== 开始完整网络测试 ===');
    
    // 依次执行测试
    setTimeout(() => this.testBasicNetwork(), 500);
    setTimeout(() => this.testBackendAPI(), 2000);
    setTimeout(() => this.testDifferentIPs(), 4000);
    
    setTimeout(() => {
      this.addResult('=== 测试完成 ===');
      this.setData({ isTest: false });
    }, 10000);
  },

  // 清空结果
  clearResults() {
    this.setData({
      testResults: []
    });
  },

  // 复制结果
  copyResults() {
    const results = this.data.testResults.map(r => `${r.time}: ${r.message}`).join('\n');
    wx.setClipboardData({
      data: results,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  }
});