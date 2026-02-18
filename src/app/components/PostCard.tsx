import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Share2, Lock, DollarSign } from 'lucide-react';
import { Post } from '../types';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PaymentModal } from './PaymentModal';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'ppv'>('subscription');
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleUnlock = (type: 'subscription' | 'ppv') => {
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      console.log('Comment submitted:', commentText, 'for post:', post.id);
      setCommentText('');
      setShowComments(false);
    }
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleShareTo = (platform: string) => {
    console.log('Share to:', platform, 'post:', post.id);
    setShowShareOptions(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          {/* Creator Header */}
          <div className="p-4 flex items-center justify-between">
            <Link to={`/creator/${post.creator.id}`} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.creator.avatar} alt={post.creator.displayName} />
                <AvatarFallback>{post.creator.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.creator.displayName}</p>
                <p className="text-sm text-zinc-400">@{post.creator.username}</p>
              </div>
            </Link>
            
            <div className="text-sm text-zinc-400">{post.timestamp}</div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-zinc-200">{post.content}</p>
          </div>

          {/* Media */}
          {post.images.length > 0 && (
            <div className="relative">
              <img
                src={post.images[0]}
                alt="Post content"
                className={`w-full aspect-[4/3] object-cover ${
                  post.isLocked ? 'blur-2xl' : ''
                }`}
              />
              
              {post.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="w-12 h-12 mx-auto mb-3 text-zinc-400" />
                    {post.lockType === 'subscription' && (
                      <>
                        <p className="mb-2">订阅解锁</p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleUnlock('subscription')}
                        >
                          订阅 ${post.creator.subscriptionPrice}/月
                        </Button>
                      </>
                    )}
                    {post.lockType === 'ppv' && (
                      <>
                        <p className="mb-2">解锁此内容</p>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700" 
                          onClick={() => handleUnlock('ppv')}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          解锁费用 ${post.price}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="p-4 flex items-center gap-6">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 ${
                post.isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            
            <button 
              className="flex items-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors"
              onClick={handleCommentClick}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>

            <button 
              className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors"
              onClick={handleShareClick}
            >
              <Share2 className="w-5 h-5" />
              <span>分享</span>
            </button>

            {post.lockType !== 'free' && (
              <Badge variant="outline" className="ml-auto">
                {post.lockType === 'subscription' ? '仅限订阅者' : `$${post.price}`}
              </Badge>
            )}

            {/* Share Options */}
            {showShareOptions && (
              <div className="absolute bottom-16 right-4 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-3 z-10">
                <div className="flex flex-col gap-2">
                  <button 
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-800 rounded"
                    onClick={() => handleShareTo('twitter')}
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    分享到 Twitter
                  </button>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-800 rounded"
                    onClick={() => handleShareTo('facebook')}
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    分享到 Facebook
                  </button>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-800 rounded"
                    onClick={() => handleShareTo('copy')}
                  >
                    <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    复制链接
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comment Input Section */}
          {showComments && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="写下你的评论..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button 
                      className="px-3 py-1 text-sm text-zinc-400 hover:text-zinc-300"
                      onClick={() => setShowComments(false)}
                    >
                      取消
                    </button>
                    <button 
                      className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded"
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                    >
                      发布评论
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={paymentType === 'subscription' ? post.creator.subscriptionPrice : (post.price || 0)}
          type={paymentType}
          creatorName={post.creator.displayName}
        />
      )}
    </>
  );
}
