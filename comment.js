import db from '../lib/db.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function authUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  return db.sessions.get(token) || null;
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(404).json({ code: 404, msg: '方法不允许' });
  }

  const user = authUser(req);
  if (!user) return res.status(401).json({ code: 401, msg: '请先登录' });

  const { postId, content } = req.body || {};
  if (!postId) return res.json({ code: 1, msg: '缺少 postId' });
  if (!content || !content.trim()) return res.json({ code: 1, msg: '评论内容不能为空' });
  if (content.length > 500) return res.json({ code: 1, msg: '评论不超过 500 字' });

  const pid = Number(postId);
  const post = db.posts.find(p => p.id === pid);
  if (!post) return res.status(404).json({ code: 404, msg: '帖子不存在' });

  const list = db.comments.filter(c => c.postId === pid);
  const floor = list.length + 1;
  const newComment = {
    id: db.nextCommentId++,
    postId: pid,
    floor,
    author: user.username,
    content: content.trim(),
    createdAt: Date.now()
  };
  db.comments.push(newComment);
  return res.json({ code: 0, msg: '评论成功', data: newComment });
}
