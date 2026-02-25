# Railway 部署指南

## 一、准备工作

### 1. 注册 Railway 账号
- 访问 [railway.app](https://railway.app)
- 使用 GitHub 账号登录（推荐）

### 2. 准备 GitHub 仓库
- 将代码推送到 GitHub
- 确保 `.env` 文件不要提交（已在 .gitignore 中）

---

## 二、部署步骤

### 步骤 1：创建新项目

1. 登录 Railway Dashboard
2. 点击 **New Project**
3. 选择 **Deploy from GitHub repo**
4. 授权 GitHub 并选择你的仓库

### 步骤 2：配置环境变量

在项目设置中添加环境变量：

```
DATABASE_URL=file:./db/custom.db
```

### 步骤 3：添加持久化存储

1. 进入项目 → Settings → Volumes
2. 点击 **Add Volume**
3. 配置两个 Volume：

| Volume 名称 | 挂载路径 | 大小 |
|------------|---------|------|
| data | /app/db | 1GB |
| uploads | /app/public/uploads | 1GB |

### 步骤 4：部署

点击 **Deploy** 按钮，等待构建完成。

---

## 三、自定义域名（可选）

1. 进入项目 → Settings → Domains
2. 点击 **Generate Domain** 获得免费域名
3. 或添加自定义域名

---

## 四、费用说明

| 项目 | 免费额度 | 说明 |
|-----|---------|------|
| 运行时间 | $5/月额度 | 约 500 小时 |
| 内存 | 512MB | 可升级 |
| 持久化存储 | 1GB | Volume |

**预估费用**：
- 小流量网站：**免费**（$5 额度内）
- 超额后：约 $0.01/小时（¥0.07/小时）

---

## 五、常见问题

### Q: 数据库丢失？
A: 确保 Volume 已正确挂载到 `/app/db`

### Q: 图片丢失？
A: 确保 Volume 已正确挂载到 `/app/public/uploads`

### Q: 部署失败？
A: 查看 Deploy Logs，检查构建错误

---

## 六、备选方案

如果 Railway 不满足需求，可以考虑：

| 平台 | 费用 | 特点 |
|-----|------|------|
| **Zeabur** | 有免费额度 | 国内访问较好 |
| **Render** | 免费 | 休眠后冷启动 |
| **Fly.io** | 有免费额度 | 全球部署 |

---

## 需要帮助？

如果部署遇到问题，可以：
1. 查看 Railway 文档：docs.railway.app
2. 查看 Deploy Logs 排查错误
