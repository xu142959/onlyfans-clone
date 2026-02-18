
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

import { mockChats } from '../data/mockData';
import { motion } from 'motion/react';

export function ChatListPage() {
  // 从 localStorage 加载未读状态，如果没有则使用初始值
  const loadChatsFromStorage = () => {
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      try {
        return JSON.parse(storedChats);
      } catch (error) {
        console.error('Error parsing stored chats:', error);
        return mockChats;
      }
    }
    return mockChats;
  };

  // 添加状态管理，用于存储聊天的未读状态
  const [chats, setChats] = useState(loadChatsFromStorage);

  // 当 chats 状态变化时，将其存储到 localStorage
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // 处理点击聊天项的事件，将未读消息数量设置为 0
  const handleChatClick = (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Messages</h2>
        <p className="text-zinc-400">Chat with your favorite creators</p>
      </div>

      <div className="space-y-2">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to={`/chat/${chat.creator.id}`} onClick={() => handleChatClick(chat.id)}>
              <Card className="bg-zinc-900 border-zinc-800 p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={chat.creator.avatar} alt={chat.creator.displayName} />
                      <AvatarFallback>{chat.creator.displayName[0]}</AvatarFallback>
                    </Avatar>
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                        {chat.unread}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{chat.creator.displayName}</h4>
                    <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-500">{chat.timestamp}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
