# 易享生活 - 无人值守棋牌室小程序

## 项目简介
易享生活是一个完整的无人值守棋牌室管理系统，包含微信小程序前端和Spring Boot后端。

## 项目结构
- **miniprogram/** - 微信小程序前端
- **backend/** - Spring Boot后端服务
- **deploy/** - 部署配置文件
- **docs/** - 项目文档
- **docker/** - Docker配置

## 快速启动
`ash
# 启动后端服务
cd backend
./mvnw spring-boot:run

# 或使用一键部署脚本
./go.bat
`

## 主要功能
- 门店管理
- 房间预订
- 用户管理
- 钱包充值
- 微信支付
- 智能门锁控制

## 技术栈
- 前端：微信小程序
- 后端：Spring Boot + MySQL
- 支付：微信支付 + 支付宝
- 部署：Docker + Nginx

更多详细信息请查看 readme.md 文件。
