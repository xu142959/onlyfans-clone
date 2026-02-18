import { Creator, Post, ChatConversation, Notification, Transaction, CreatorStats } from '../types';

export const mockCreators: Creator[] = [
  {
    id: '1',
    username: 'sophia_belle',
    displayName: '索菲亚·贝尔',
    avatar: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTI4NDA2MHww&ixlib=rb-4.1.0&q=80&w=400',
    cover: 'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    bio: '内容创作者、模特和健身爱好者 💪✨ 加入获取独家内容和幕后花絮！',
    subscriptionPrice: 9.99,
    subscriptionPriceYearly: 99.99,
    subscriberCount: 12543,
    postCount: 342,
    mediaCount: 1289,
    tags: ['健身', '生活方式', '时尚'],
    socialLinks: {
      instagram: '@sophia_belle',
      twitter: '@sophiabelle'
    }
  },
  {
    id: '2',
    username: 'alex_knight',
    displayName: '亚历克斯·奈特',
    avatar: 'https://images.unsplash.com/photo-1631395774172-3d42655a3dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    cover: 'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    bio: '专业摄影师和创意艺术家 📸 分享我的旅程和独家拍摄',
    subscriptionPrice: 14.99,
    subscriptionPriceYearly: 149.99,
    subscriberCount: 8765,
    postCount: 234,
    mediaCount: 892,
    tags: ['摄影', '艺术', '创意'],
    socialLinks: {
      instagram: '@alexknight'
    }
  },
  {
    id: '3',
    username: 'maya_fitness',
    displayName: '玛雅·罗德里格斯',
    avatar: 'https://images.unsplash.com/photo-1648863397001-cd77a7e98bd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    cover: 'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    bio: '认证私人教练和健康教练 🏋️‍♀️ 分享 workout routines, nutrition tips & exclusive fitness content',
    subscriptionPrice: 12.99,
    subscriptionPriceYearly: 119.99,
    subscriberCount: 15234,
    postCount: 456,
    mediaCount: 1523,
    tags: ['健身', '健康', '训练'],
    socialLinks: {
      instagram: '@mayafitness',
      twitter: '@mayarodriguez'
    }
  },
  {
    id: '4',
    username: 'artistic_soul',
    displayName: '露娜·斯通',
    avatar: 'https://images.unsplash.com/photo-1660018322118-184703f102fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    cover: 'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    bio: '艺术家和创意 visionary 🎨 原创 artwork, exclusive tutorials, and creative inspiration',
    subscriptionPrice: 7.99,
    subscriptionPriceYearly: 79.99,
    subscriberCount: 6543,
    postCount: 189,
    mediaCount: 567,
    tags: ['艺术', '创意', '教程'],
    socialLinks: {}
  },
  {
    id: '5',
    username: 'fashionista_elite',
    displayName: '伊莎贝拉·罗斯',
    avatar: 'https://images.unsplash.com/photo-1637067751055-4c75acba9936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    cover: 'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    bio: 'Fashion model & style influencer 👗✨ Exclusive fashion shoots and styling tips',
    subscriptionPrice: 19.99,
    subscriptionPriceYearly: 199.99,
    subscriberCount: 23456,
    postCount: 678,
    mediaCount: 2345,
    tags: ['时尚', '风格', '模特'],
    socialLinks: {
      instagram: '@isabellarose',
      twitter: '@bellafashion'
    }
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    creatorId: '1',
    creator: mockCreators[0],
    content: '晨间锻炼完成！💪 为我的订阅者准备了新的独家内容',
    images: [
      'https://images.unsplash.com/photo-1648863397001-cd77a7e98bd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    ],
    videos: [],
    timestamp: '2小时前',
    likes: 342,
    comments: 45,
    isLocked: true,
    lockType: 'subscription',
    isLiked: false
  },
  {
    id: '2',
    creatorId: '2',
    creator: mockCreators[1],
    content: '今天拍摄的幕后花絮 📸',
    images: [
      'https://images.unsplash.com/photo-1660018322118-184703f102fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    ],
    videos: [],
    timestamp: '5小时前',
    likes: 567,
    comments: 78,
    isLocked: true,
    lockType: 'ppv',
    price: 4.99,
    isLiked: false
  },
  {
    id: '3',
    creatorId: '3',
    creator: mockCreators[2],
    content: '免费健身提示：每天从10分钟的伸展运动开始！完整的训练计划仅供订阅者使用 🏋️‍♀️',
    images: [],
    videos: [],
    timestamp: '1天前',
    likes: 234,
    comments: 32,
    isLocked: false,
    lockType: 'free',
    isLiked: true
  },
  {
    id: '4',
    creatorId: '4',
    creator: mockCreators[3],
    content: '新作品完成！内部有过程视频 🎨',
    images: [
      'https://images.unsplash.com/photo-1704022810195-de7199db478c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    ],
    videos: [],
    timestamp: '2天前',
    likes: 189,
    comments: 23,
    isLocked: true,
    lockType: 'subscription',
    isLiked: false
  },
  {
    id: '5',
    creatorId: '5',
    creator: mockCreators[4],
    content: '巴黎时装周的独家时尚拍摄 👗✨',
    images: [
      'https://images.unsplash.com/photo-1637067751055-4c75acba9936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    ],
    videos: [],
    timestamp: '3天前',
    likes: 892,
    comments: 134,
    isLocked: true,
    lockType: 'subscription',
    isLiked: true
  }
];

export const mockChats: ChatConversation[] = [
  {
    id: '1',
    creator: mockCreators[0],
    lastMessage: '感谢订阅！💕',
    timestamp: '10分钟前',
    unread: 2
  },
  {
    id: '2',
    creator: mockCreators[1],
    lastMessage: '查看我的最新帖子！',
    timestamp: '1小时前',
    unread: 0
  },
  {
    id: '3',
    creator: mockCreators[2],
    lastMessage: '🔒 解锁获取独家内容',
    timestamp: '2小时前',
    unread: 1
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_post',
    title: '新帖子',
    message: '索菲亚·贝尔发布了新内容',
    timestamp: '5分钟前',
    read: false,
    creator: mockCreators[0]
  },
  {
    id: '2',
    type: 'new_message',
    title: '新消息',
    message: '你收到了亚历克斯·奈特的新消息',
    timestamp: '1小时前',
    read: false,
    creator: mockCreators[1]
  },
  {
    id: '3',
    type: 'subscription',
    title: '订阅已续费',
    message: '你对玛雅·罗德里格斯的订阅已续费',
    timestamp: '1天前',
    read: true,
    creator: mockCreators[2]
  },
  {
    id: '4',
    type: 'system',
    title: '系统通知',
    message: '新功能可用！快来看看',
    timestamp: '2天前',
    read: true
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'subscription',
    amount: -9.99,
    creator: mockCreators[0],
    timestamp: '2024-02-15',
    status: 'completed'
  },
  {
    id: '2',
    type: 'ppv',
    amount: -4.99,
    creator: mockCreators[1],
    timestamp: '2024-02-14',
    status: 'completed'
  },
  {
    id: '3',
    type: 'subscription',
    amount: -12.99,
    creator: mockCreators[2],
    timestamp: '2024-02-10',
    status: 'completed'
  },
  {
    id: '4',
    type: 'tip',
    amount: -5.00,
    creator: mockCreators[0],
    timestamp: '2024-02-08',
    status: 'completed'
  }
];

export const mockCreatorStats: CreatorStats = {
  todayEarnings: 342.50,
  subscribers: 12543,
  messages: 89,
  totalEarnings: 45678.90,
  chartData: [
    { date: '2/10', earnings: 280 },
    { date: '2/11', earnings: 320 },
    { date: '2/12', earnings: 290 },
    { date: '2/13', earnings: 410 },
    { date: '2/14', earnings: 380 },
    { date: '2/15', earnings: 450 },
    { date: '2/16', earnings: 520 },
    { date: '2/17', earnings: 342 }
  ]
};
