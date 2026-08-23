# 驭鬼者论坛 · 后端 API (Vercel)

神秘复苏主题论坛的 Serverless 后端。

## 接口

- `GET  /api/posts?category=...&keyword=...` 帖子列表
- `POST /api/posts` 发帖（需登录）
- `GET  /api/posts/:id` 帖子详情
- `GET  /api/posts/:id/comments` 评论列表
- `POST /api/posts/:id/comments` 发评论（需登录）
- `POST /api/login` 登录
- `POST /api/register` 注册
- `GET  /api/me` 当前用户（需登录）
- `GET  /api/stats` 统计

## 默认账号

- 杨间 / 123456
- 守夜人 / 123456
- 鬼差猎人 / 123456
- 敲门鬼目击者 / 123456

## 数据说明

数据存储在内存中，每次冷启动会重置为种子数据。如需持久化请接 Vercel KV 或外部数据库。
