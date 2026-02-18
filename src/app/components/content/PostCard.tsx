
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Post } from '../../types';
import {
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  Calendar,
  Lock,
  DollarSign,
} from 'lucide-react';

interface PostCardProps {
  post: Post & { status: 'published' | 'archived' | 'draft' };
  onEdit: (postId: string) => void;
  onArchive: (postId: string) => void;
  onDelete: (postId: string) => void;
  onToggleVisibility: (postId: string) => void;
}

export function PostCard({ post, onEdit, onArchive, onDelete, onToggleVisibility }: PostCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'archived':
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
      case 'draft':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
    }
  };

  const getLockTypeIcon = (lockType: Post['lockType']) => {
    switch (lockType) {
      case 'free':
        return <Eye className="w-4 h-4 text-green-500" />;
      case 'subscription':
        return <Lock className="w-4 h-4 text-blue-500" />;
      case 'ppv':
        return <DollarSign className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4 hover:bg-zinc-800/50 transition-colors">
      <div className="flex gap-4">
        {/* Preview Image */}
        {post.images.length > 0 && (
          <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-zinc-800">
            <img
              src={post.images[0]}
              alt="Post preview"
              className={`w-full h-full object-cover ${post.isLocked ? 'blur-sm' : ''}`}
            />
          </div>
        )}

        {/* Post Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(post.status)}>
                  {post.status === 'published' ? '已发布' : post.status === 'archived' ? '已归档' : '草稿'}
                </Badge>
                
                <div className="flex items-center gap-1">
                  {getLockTypeIcon(post.lockType)}
                  <span className="text-xs text-zinc-500">
                    {post.lockType === 'free' && '免费'}
                    {post.lockType === 'subscription' && '仅限订阅者'}
                    {post.lockType === 'ppv' && `$${post.price}`}
                  </span>
                </div>
              </div>

              <p className="text-zinc-200 mb-2 line-clamp-2">{post.content}</p>
              
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.timestamp}
                </span>
                <span>{post.likes} 赞</span>
                <span>{post.comments} 评论</span>
                {post.images.length > 0 && (
                  <span>{post.images.length} 张图片</span>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem
                  onClick={() => onEdit(post.id)}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  编辑内容
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => onToggleVisibility(post.id)}
                  className="cursor-pointer"
                >
                  {post.isLocked ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      设为公开
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      设为私密
                    </>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => onArchive(post.id)}
                  className="cursor-pointer"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {post.status === 'archived' ? '恢复' : '归档'}
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => onDelete(post.id)}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PostCard;