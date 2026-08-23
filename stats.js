import db from '../lib/db.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.json({
    code: 0,
    msg: 'ok',
    data: {
      posts: db.posts.length,
      comments: db.comments.length,
      users: db.users.length
    }
  });
}
