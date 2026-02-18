export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'fan' | 'creator' | 'admin';
  isCreator: boolean;
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  cover: string;
  bio: string;
  subscriptionPrice: number;
  subscriptionPriceYearly: number;
  subscriberCount: number;
  postCount: number;
  mediaCount: number;
  tags: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
  };
}

export interface Post {
  id: string;
  creatorId: string;
  creator: Creator;
  content: string;
  images: string[];
  videos: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLocked: boolean;
  lockType: 'subscription' | 'ppv' | 'free';
  price?: number;
  isLiked: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isLocked: boolean;
  price?: number;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
}

export interface ChatConversation {
  id: string;
  creator: Creator;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface Notification {
  id: string;
  type: 'new_post' | 'new_message' | 'subscription' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  creator?: Creator;
}

export interface Transaction {
  id: string;
  type: 'subscription' | 'ppv' | 'chat' | 'tip';
  amount: number;
  creator?: Creator;
  timestamp: string;
  status: 'completed' | 'pending' | 'refunded';
}

export interface CreatorStats {
  todayEarnings: number;
  subscribers: number;
  messages: number;
  totalEarnings: number;
  chartData: {
    date: string;
    earnings: number;
  }[];
}
