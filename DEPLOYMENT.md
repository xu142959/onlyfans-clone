# 部署指南

本指南将帮助您部署Fansly Clone项目到生产环境。

## 目录结构

```
├── src/             # 前端源代码
├── backend/         # 后端源代码
├── public/          # 静态资源
├── dist/            # 构建输出目录
├── .github/         # GitHub Actions配置
├── .env             # 环境变量配置
├── .env.production  # 生产环境变量配置
└── package.json     # 项目配置和依赖
```

## 前置要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- MongoDB 4.0 或更高版本
- Stripe 账号（用于支付功能）

## 环境变量配置

### 前端环境变量

在`.env.production`文件中配置以下环境变量：

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com/api

# WebSocket Configuration
VITE_WS_URL=wss://api.yourdomain.com

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# Environment
NODE_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_CHAT=true
```

### 后端环境变量

在后端目录中创建`.env`文件，配置以下环境变量：

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/fansly-clone

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# CORS Configuration
FRONTEND_URL=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
FROM_EMAIL=no-reply@yourdomain.com
```

## 前端部署

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 部署构建输出

构建完成后，`dist`目录中的文件将包含所有静态资源。您可以将这些文件部署到任何静态网站托管服务，例如：

- Vercel
- Netlify
- AWS S3 + CloudFront
- Google Cloud Storage + Cloud CDN
- 传统的Nginx/Apache服务器

### 4. 配置Nginx（可选）

如果您使用Nginx作为Web服务器，可以使用以下配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    root /path/to/your/project/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket代理
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 后端部署

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 启动服务器

使用PM2或其他进程管理器来管理后端服务：

```bash
# 安装PM2
npm install -g pm2

# 启动后端服务
pm run start:prod

# 或者使用PM2
pm run build
pm run start:pm2
```

### 3. 配置MongoDB

确保MongoDB服务正在运行，并且您已经创建了相应的数据库和用户：

```bash
# 连接到MongoDB
mongo

# 创建数据库
use fansly-clone

# 创建用户
db.createUser({
  user: "fansly-user",
  pwd: "your-password",
  roles: ["readWrite", "dbAdmin"]
});
```

## CI/CD配置

本项目使用GitHub Actions进行CI/CD，配置文件位于`.github/workflows/ci-cd.yml`。

### 工作流程

1. **测试**：运行单元测试和代码 linting
2. **构建**：构建前端项目
3. **部署**：将构建输出部署到生产环境

### 配置步骤

1. 在GitHub仓库中添加以下secrets：
   - `NODE_ENV`：设置为`production`
   - `VITE_API_BASE_URL`：设置为您的API基础URL
   - `VITE_WS_URL`：设置为您的WebSocket URL
   - `VITE_STRIPE_PUBLIC_KEY`：设置为您的Stripe公钥
   - 其他部署相关的secrets（如Vercel token、Netlify token等）

2. 推送代码到`main`或`master`分支，GitHub Actions将自动运行部署流程。

## 监控和日志

### 前端监控

- 使用Google Analytics或Matomo跟踪用户行为
- 使用Sentry或Bugsnag监控前端错误

### 后端监控

- 使用PM2的内置监控功能：`pm2 monit`
- 使用ELK Stack或Graylog收集和分析日志
- 使用Prometheus和Grafana监控服务器性能

### 健康检查

后端提供了健康检查端点，您可以使用它来监控服务状态：

```bash
GET /api/health
```

## 性能优化

### 前端优化

- 代码分割：使用动态导入减少初始加载时间
- 图片优化：使用响应式图片和懒加载
- 缓存策略：使用Service Worker缓存静态资源
- CDN：使用CDN分发静态资源

### 后端优化

- 数据库索引：为频繁查询的字段添加索引
- 缓存：使用Redis缓存热点数据
- 负载均衡：使用Nginx或AWS ELB进行负载均衡
- 水平扩展：根据需要添加更多服务器实例

## 安全性

### 前端安全

- 使用HTTPS加密传输
- 实施内容安全策略（CSP）
- 防止XSS攻击：使用React的内置XSS防护
- 防止CSRF攻击：使用CSRF令牌

### 后端安全

- 使用HTTPS加密传输
- 实施API速率限制
- 验证和清理所有用户输入
- 使用参数化查询防止SQL注入
- 定期更新依赖项以修复安全漏洞

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查API基础URL是否正确
   - 确保后端服务正在运行
   - 检查网络连接和防火墙设置

2. **支付功能不工作**
   - 检查Stripe API密钥是否正确
   - 确保Stripe Webhook配置正确
   - 检查支付流程中的错误日志

3. **WebSocket连接失败**
   - 检查WebSocket URL是否正确
   - 确保后端WebSocket服务正在运行
   - 检查网络连接和防火墙设置

### 日志查看

- 前端日志：在浏览器开发者工具的控制台中查看
- 后端日志：使用`pm2 logs`查看后端服务日志

## 维护和更新

### 定期任务

- 备份数据库
- 更新依赖项以修复安全漏洞
- 监控服务器性能和资源使用

### 版本管理

- 使用语义化版本控制
- 维护变更日志
- 测试所有变更后再部署到生产环境

## 联系支持

如果您在部署过程中遇到任何问题，请参考以下资源：

- [项目文档](README.md)
- [后端API文档](backend/API.md)
- [Stripe文档](https://stripe.com/docs)
- [MongoDB文档](https://docs.mongodb.com/)

---

祝您部署顺利！
