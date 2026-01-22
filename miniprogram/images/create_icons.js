// 创建基础图标的脚本
// 由于无法直接生成PNG文件，这里提供图标的SVG代码和获取方案

const icons = {
  'home.png': {
    description: '首页图标',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    activeColor: '#1890ff'
  },
  'store.png': {
    description: '门店图标',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10C21 16 12 23 12 23S3 16 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    activeColor: '#1890ff'
  },
  'order.png': {
    description: '订单图标',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    activeColor: '#1890ff'
  },
  'profile.png': {
    description: '个人中心图标',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    activeColor: '#1890ff'
  }
};

console.log('图标SVG代码已准备，请使用在线SVG转PNG工具转换');
console.log('推荐工具: https://convertio.co/svg-png/ 或 https://cloudconvert.com/svg-to-png');
console.log('图标尺寸建议: 48x48px (普通) 和 48x48px (选中状态，使用activeColor)');