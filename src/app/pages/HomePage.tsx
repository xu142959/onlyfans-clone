import { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { mockPosts } from '../data/mockData';

export function HomePage() {
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">你的动态</h2>
        <p className="text-zinc-400">来自你关注的创作者的最新内容</p>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
        />
      ))}
    </div>
  );
}
