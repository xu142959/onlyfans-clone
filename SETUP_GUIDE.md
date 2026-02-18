# 🚀 FanVault 设置指南

欢迎使用FanVault内容创作者平台！本指南将帮助你快速设置和运行应用程序。

## 📋 目录

1. [环境要求](#环境要求)
2. [安装步骤](#安装步骤)
3. [Stripe配置](#stripe配置)
4. [功能说明](#功能说明)
5. [常见问题](#常见问题)

---

## 🛠️ 环境要求

- **Node.js**: v18.0.0 或更高版本
- **pnpm**: v8.0.0 或更高版本（推荐）
- **现代浏览器**: Chrome, Firefox, Safari, Edge（最新版本）

---

## 📦 安装步骤

### 1. 克隆项目（如果适用）

```bash
git clone <repository-url>
cd fanvault
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

### 4. 配置Stripe API密钥

编辑 `.env` 文件，填入你的Stripe API密钥（详见下方Stripe配置部分）。

### 5. 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 运行。

---

## 💳 Stripe配置

### 获取Stripe API密钥

1. **注册Stripe账户**
   - 访问 [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - 创建一个新账户或登录现有账户

2. **获取测试密钥**
   - 登录Stripe Dashboard
   - 导航到 **开发者 → API密钥**
   - 确保你在 **测试模式** 下（顶部有"测试模式"标识）
   - 复制以下密钥：
     - **公钥 (Publishable key)**: 以 `pk_test_` 开头
     - **密钥 (Secret key)**: 以 `sk_test_` 开头

3. **配置到.env文件**

在 `.env` 文件中更新以下变量：

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

### ⚠️ 重要安全提示

- **测试环境**: 目前配置使用的是测试密钥（`pk_test_` 和 `sk_test_`）
- **生产环境**: 上线前必须替换为生产密钥（`pk_live_` 和 `sk_live_`）
- **密钥保护**: 
  - 永远不要将 `.env` 文件提交到版本控制系统
  - 密钥应该通过环境变量注入，而不是硬编码
  - Secret Key 应该只在服务器端使用

### 测试支付

使用以下Stripe测试卡号：

- **成功支付**: `4242 4242 4242 4242`
- **需要验证**: `4000 0025 0000 3155`
- **支付失败**: `4000 0000 0000 9995`
- **过期日期**: 任何未来日期（如 `12/34`）
- **CVC**: 任何3位数字（如 `123`）

---

## ✨ 功能说明

### 已集成的高级功能

#### 1. **Stripe支付集成** 💳
- **位置**: 订阅创作者、打赏、购买PPV内容时使用
- **组件**: `StripePaymentModal.tsx`
- **功能**: 
  - 真实的Stripe Elements集成
  - 支持卡片支付
  - 支付流程动画
  - 错误处理和验证

#### 2. **图片编辑器** 🖼️
- **位置**: 创建内容页面上传图片后
- **组件**: `ImageEditor.tsx`
- **功能**:
  - 图片裁剪
  - 旋转、缩放
  - 亮度、对比度、饱和度调整
  - 实时预览
  - 高质量导出

#### 3. **视频处理器** 🎥
- **位置**: 创建内容页面上传视频后
- **组件**: `VideoProcessor.tsx`
- **功能**:
  - 视频压缩（质量选择）
  - 格式转码
  - 视频裁剪
  - 进度指示
  - 播放预览

#### 4. **数据分析** 📊
- **位置**: 创作者导航 → Analytics
- **页面**: `AnalyticsPage.tsx`
- **功能**:
  - 收入趋势图表
  - 订阅者增长分析
  - 内容表现统计
  - 粉丝互动数据
  - 导出报告

#### 5. **实时通知系统** 🔔
- **位置**: 顶部导航栏
- **组件**: `NotificationCenter.tsx`
- **功能**:
  - 实时通知推送
  - 分类显示（打赏、订阅、评论等）
  - 未读标记
  - 快速操作
  - 通知设置

#### 6. **定时发布** ⏰
- **位置**: 创建内容页面
- **组件**: `SchedulePostModal.tsx`
- **功能**:
  - 日期时间选择
  - 时区支持
  - 预约发布队列
  - 编辑/取消预约
  - 发布提醒

---

## 🎨 技术栈

- **前端框架**: React 18 + TypeScript
- **路由**: React Router v7
- **样式**: Tailwind CSS v4
- **UI组件**: Radix UI + shadcn/ui
- **动画**: Motion (Framer Motion)
- **表单**: React Hook Form
- **支付**: Stripe React SDK
- **图表**: Recharts
- **图片处理**: react-image-crop
- **通知**: Sonner

---

## 🚦 常见问题

### Q1: Stripe支付测试失败怎么办？

**A**: 
1. 确认`.env`文件中的API密钥正确
2. 检查是否在测试模式下
3. 使用Stripe提供的测试卡号
4. 查看浏览器控制台的错误信息

### Q2: 图片上传后无法编辑？

**A**: 
1. 检查文件格式是否支持（JPG, PNG, WebP）
2. 确认文件大小在限制范围内（默认100MB）
3. 清除浏览器缓存后重试

### Q3: 视频处理需要多长时间？

**A**: 
- 取决于视频大小和压缩质量
- 低质量: ~10秒
- 中等质量: ~30秒
- 高质量: ~1-2分钟
- 注意：这是客户端处理，实际项目建议使用服务器端处理

### Q4: 如何切换到生产环境？

**A**: 
1. 在Stripe Dashboard切换到生产模式
2. 获取生产API密钥（`pk_live_` 和 `sk_live_`）
3. 更新`.env`文件中的密钥
4. 运行 `pnpm build` 构建生产版本
5. 部署到生产服务器

### Q5: 通知是真实的实时通知吗？

**A**: 
- 当前版本使用模拟数据和定时器
- 生产环境建议集成WebSocket或Server-Sent Events
- 可以考虑使用Firebase、Pusher或自建WebSocket服务

---

## 📝 开发建议

### 本地开发

```bash
# 启动开发服务器（热重载）
pnpm dev

# 类型检查
pnpm tsc --noEmit

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 代码规范

- 使用TypeScript严格模式
- 遵循React Hooks最佳实践
- 组件应保持单一职责
- 适当使用错误边界
- 编写语义化的HTML

### 性能优化

- 使用React.memo避免不必要的重渲染
- 懒加载大型组件和路由
- 优化图片和视频资源
- 使用虚拟滚动处理长列表
- 合理使用缓存策略

---

## 🆘 获取帮助

- **Stripe文档**: [https://stripe.com/docs](https://stripe.com/docs)
- **React文档**: [https://react.dev](https://react.dev)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

## 📄 许可证

本项目仅供学习和开发使用。

---

**祝你使用愉快！** 🎉

如果你遇到任何问题，请查看上方的常见问题部分或查阅相关文档。
