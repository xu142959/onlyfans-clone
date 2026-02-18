import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { mockCreators } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ArrowLeft, Send, Image as ImageIcon, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useWs } from '../../api/ws/WsContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'creator';
  timestamp: string;
  isLocked?: boolean;
  price?: number;
}

export function ChatRoomPage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const creator = mockCreators.find(c => c.id === creatorId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey! Thanks for subscribing! 💕',
      sender: 'creator',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      content: 'Hi! Love your content!',
      sender: 'user',
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      content: 'I have some exclusive content just for you...',
      sender: 'creator',
      timestamp: '10:35 AM',
      isLocked: true,
      price: 9.99
    }
  ]);
  const { wsService } = useWs();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 监听WebSocket消息
  useEffect(() => {
    if (!creatorId) return;

    // 监听新消息
    const handleNewMessage = (data: any) => {
      if (data.creatorId === creatorId) {
        setMessages(prev => [...prev, {
          id: data.id,
          content: data.content,
          sender: 'creator',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLocked: data.isLocked,
          price: data.price
        }]);
      }
    };

    // 监听消息状态更新
    const handleMessageStatus = (data: any) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId ? { ...msg, ...data.status } : msg
      ));
    };

    wsService.on('message', handleNewMessage);
    wsService.on('messageStatus', handleMessageStatus);

    // 清理函数
    return () => {
      wsService.off('message', handleNewMessage);
      wsService.off('messageStatus', handleMessageStatus);
    };
  }, [creatorId, wsService]);

  if (!creator) {
    return <div className="p-4">Creator not found</div>;
  }

  const handleSend = () => {
    if (message.trim() && creatorId) {
      // 创建消息对象
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // 先更新本地状态，实现乐观UI
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // 通过WebSocket发送消息
      wsService.send('sendMessage', {
        creatorId,
        content: message,
        messageId: newMessage.id
      });
    }
  };

  // 处理图片上传按钮点击
  const handleImageUpload = () => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // 监听文件选择事件
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        // 检查文件大小
        if (file.size > 5 * 1024 * 1024) {
          alert('文件大小不能超过 5MB');
          return;
        }
        
        // 创建一个预览URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          
          // 创建一个图片消息
          const imageMessage = {
            id: Date.now().toString(),
            content: `[图片]`,
            sender: 'user' as const,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          // 更新本地状态
          setMessages(prev => [...prev, imageMessage]);
          
          // 通过WebSocket发送图片消息
          wsService.send('sendImage', {
            creatorId,
            imageUrl,
            messageId: imageMessage.id
          });
        };
        reader.readAsDataURL(file);
      }
    };
    
    // 添加到DOM并触发点击
    document.body.appendChild(fileInput);
    fileInput.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(fileInput);
    }, 100);
  };

  // 处理解锁付费内容按钮点击
  const handleUnlockMessage = (messageId: string) => {
    // 显示确认对话框
    if (window.confirm('确定要解锁此付费内容吗？')) {
      // 更新消息状态，将isLocked设置为false
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, isLocked: false } : msg
        )
      );
      
      // 通过WebSocket发送解锁请求
      wsService.send('unlockMessage', {
        messageId,
        creatorId
      });
      
      // 显示成功提示
      alert('内容已解锁！');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/chat" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <Link to={`/creator/${creator.id}`} className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{creator.displayName}</p>
              <p className="text-xs text-zinc-400">@{creator.username}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.isLocked ? (
              <Card className="bg-zinc-900 border-zinc-800 p-4 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Locked Message</span>
                </div>
                <p className="text-sm text-zinc-300 mb-3 blur-sm">Exclusive content available...</p>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Unlock for ${msg.price}
                </Button>
              </Card>
            ) : (
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400" onClick={handleImageUpload}>
            <ImageIcon className="w-5 h-5" />
          </Button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="bg-zinc-800 border-zinc-700"
          />
          
          <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}