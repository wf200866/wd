import db from '../lib/db.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = Number(req.query.id);
  const post = db.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ code: 404, msg: '帖子不存在' });

  post.views += 1;
  const commentCount = db.comments.filter(c => c.postId === id).length;
  return res.json({ code: 0, msg: 'ok', data: { ...post, commentCount } });
}
