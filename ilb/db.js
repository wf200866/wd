// 内存数据库（无持久化，演示用）
// Vercel Serverless 冷启动时会重新初始化为种子数据
// 如需持久化请接 Vercel KV / Upstash Redis / Postgres

let _nextPostId = 100;
let _nextCommentId = 1000;

const users = [
  { id: 1, username: '杨间',         password: '123456', avatar: '杨', bio: '驾驭鬼眼，活下来的人',     posts: 0 },
  { id: 2, username: '守夜人',        password: '123456', avatar: '守', bio: '总部编外，洞察规律者',     posts: 0 },
  { id: 3, username: '鬼差猎人',      password: '123456', avatar: '鬼', bio: '追查S级鬼差下落的独行者',  posts: 0 },
  { id: 4, username: '敲门鬼目击者',  password: '123456', avatar: '门', bio: '三更敲门，勿应',           posts: 0 }
];

const posts = [
  {
    id: _nextPostId++,
    title: '三大铁律，驭鬼者生存的根基',
    summary: '鬼无法被杀死；能对付鬼的只有鬼；黄金能隔离鬼。',
    content: '在神秘复苏的世界里，有三条铁律：\n一、鬼无法被杀死。\n二、能对付鬼的，只有鬼。\n三、黄金能隔离鬼。',
    category: '驭鬼心得', author: '杨间', authorId: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 2, views: 8964, likes: 731
  },
  {
    id: _nextPostId++,
    title: '关于"敲门鬼"的情报',
    summary: '每敲一次门，就有一人消失。',
    content: '敲门鬼的规律是【敲门】。\n1. 不要应声。\n2. 远离门。\n3. 往黄金跑。',
    category: '鬼事实录', author: '鬼差猎人', authorId: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 5, views: 5210, likes: 402
  },
  {
    id: _nextPostId++,
    title: '关于"驭鬼"最容易死人的误区',
    summary: '驭鬼不是驯服，是互蚀。',
    content: '驭鬼不是驾驭，是"同生共死"。每用一次厉鬼的力量，它就复苏一分。',
    category: '规律情报', author: '守夜人', authorId: 2,
    createdAt: Date.now() - 1000 * 60 * 60 * 12, views: 12034, likes: 987
  }
];

const comments = [
  { id: _nextCommentId++, postId: 100, floor: 1, author: '守夜人',   content: '规矩没错。',         createdAt: Date.now() - 1000 * 60 * 60 },
  { id: _nextCommentId++, postId: 100, floor: 2, author: '鬼差猎人', content: '还有第四条：别信人皮书。', createdAt: Date.now() - 1000 * 60 * 45 }
];

const sessions = new Map();

const db = {
  users,
  posts,
  comments,
  sessions,
  get nextPostId() { return _nextPostId; },
  set nextPostId(v) { _nextPostId = v; },
  get nextCommentId() { return _nextCommentId; },
  set nextCommentId(v) { _nextCommentId = v; }
};

export default db;
