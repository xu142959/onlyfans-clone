import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { mockPosts } from '../data/mockData';
import { Post } from '../types';
import {
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { PostCard } from '../components/content/PostCard';

type PostStatus = 'published' | 'archived' | 'draft';

interface ManagedPost extends Post {
  status: PostStatus;
}

export function ManageContentPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ManagedPost[]>(
    mockPosts.map(post => ({ ...post, status: 'published' as PostStatus }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | PostStatus>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || post.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const getPostsByStatus = (status: PostStatus | 'all') => {
    if (status === 'all') return posts.length;
    return posts.filter(p => p.status === status).length;
  };

  const handleEdit = (postId: string) => {
    toast.info('正在打开内容编辑器...');
    // Navigate to edit page
    navigate(`/edit-post/${postId}`);
  };

  const handleArchive = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, status: post.status === 'archived' ? 'published' : 'archived' }
        : post
    ));
    const post = posts.find(p => p.id === postId);
    toast.success(
      post?.status === 'archived' 
        ? '内容已成功恢复' 
        : '内容已成功归档'
    );
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      setPosts(posts.filter(post => post.id !== postToDelete));
      toast.success('内容已成功删除');
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const handleVisibilityToggle = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLocked: !post.isLocked }
        : post
    ));
    toast.success('可见性已更新');
  };



  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">管理内容</h2>
          <p className="text-zinc-400">查看、编辑和管理您的所有内容</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link to="/create-post">
            <Plus className="w-4 h-4 mr-2" />
            创建新内容
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-zinc-900 border-zinc-800 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="按内容搜索内容..."
            className="pl-10 bg-zinc-800 border-zinc-700"
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
        <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
          <TabsTrigger value="all">
            全部 ({getPostsByStatus('all')})
          </TabsTrigger>
          <TabsTrigger value="published">
            已发布 ({getPostsByStatus('published')})
          </TabsTrigger>
          <TabsTrigger value="archived">
            已归档 ({getPostsByStatus('archived')})
          </TabsTrigger>
          <TabsTrigger value="draft">
            草稿 ({getPostsByStatus('draft')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
              <p className="text-zinc-400 mb-4">未找到内容</p>
              <Button variant="outline" className="border-zinc-700" asChild>
                <Link to="/create-post">创建您的第一个内容</Link>
              </Button>
            </Card>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard 
                  post={post}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                  onDelete={handleDeleteClick}
                  onToggleVisibility={handleVisibilityToggle}
                />
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>删除内容</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此内容吗？此操作无法撤销。
              所有互动数据（点赞、评论）将永久丢失。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700">取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
