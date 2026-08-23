import db from '../lib/db.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  if (req.method === 'GET') {
    const { category, keyword } = req.query;
    let list = [...db.posts];
    if (category && category !== '全部') {
      list = list.filter(p => p.category === category);
    }
    if (keyword) {
      const k = String(keyword).toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(k) ||
        p.summary.toLowerCase().includes(k) ||
        p.author.toLowerCase().includes(k)
      );
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    list = list.map(p => ({
      ...p,
      commentCount: db.comments.filter(c => c.postId === p.id).length
    }));
    return res.json({ code: 0, msg: 'ok', data: { list, total: list.length } });
  }

  if (req.method === 'POST') {
    const user = authUser(req);
    if (!user) return res.status(401).json({ code: 401, msg: '请先登录' });

    const { title, content, category } = req.body || {};
    if (!title || !content) return res.json({ code: 1, msg: '标题和内容不能为空' });
    if (title.length > 50) return res.json({ code: 1, msg: '标题不超过 50 字' });
    if (content.length > 5000) return res.json({ code: 1, msg: '内容不超过 5000 字' });

    const allowed = ['驭鬼心得', '鬼事实录', '规律情报', '求援求助'];
    const cat = allowed.includes(category) ? category : '鬼事实录';

    const newPost = {
      id: db.nextPostId++,
      title: title.trim(),
      summary: content.trim().slice(0, 60) + (content.length > 60 ? '…' : ''),
      content: content.trim(),
      category: cat,
      author: user.username,
      authorId: user.id,
      createdAt: Date.now(),
      views: 0,
      likes: 0
    };
    db.posts.push(newPost);
    const u = db.users.find(x => x.id === user.id);
    if (u) u.posts += 1;
    return res.json({ code: 0, msg: '发布成功', data: newPost });
  }

  return res.status(404).json({ code: 404, msg: '方法不允许' });
}
