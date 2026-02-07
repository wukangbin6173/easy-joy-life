// 测试 MySQL 数据库连接
const net = require('net');

const host = '121.43.96.127';
const port = 3306;
const timeout = 5000;

console.log(`正在测试连接到 ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(timeout);

socket.on('connect', () => {
  console.log('✓ TCP 连接成功！');
  console.log(`✓ 可以通过 ${host}:${port} 访问 MySQL 服务`);
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  console.log('✗ 连接超时');
  socket.destroy();
  process.exit(1);
});

socket.on('error', (err) => {
  console.log('✗ 连接失败:', err.message);
  process.exit(1);
});

socket.connect(port, host);
