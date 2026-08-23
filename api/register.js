import db from '../lib/db.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function makeToken() {
  return 'tk_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(404).json({ code: 404, msg: '方法不允许' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) return res.json({ code: 1, msg: '用户名和密码不能为空' });
  if (username.length < 2 || username.length > 12) return res.json({ code: 1, msg: '用户名长度需在 2-12 之间' });
  if (password.length < 4) return res.json({ code: 1, msg: '密码至少 4 位' });
  if (db.users.some(u => u.username === username)) return res.json({ code: 1, msg: '该代号已被占用' });

  const newUser = {
    id: db.users.length + 1,
    username,
    password,
    avatar: username[0],
    bio: '初入诡闻录',
    posts: 0
  };
  db.users.push(newUser);

  const token = makeToken();
  db.sessions.set(token, { id: newUser.id, username: newUser.username, avatar: newUser.avatar, bio: newUser.bio });

  return res.json({
    code: 0,
    msg: '注册成功',
    data: {
      token,
      user: { id: newUser.id, username: newUser.username, avatar: newUser.avatar, bio: newUser.bio, posts: 0 }
    }
  });
}
