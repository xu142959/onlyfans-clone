import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { mockCreators, mockPosts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PostCard } from '../components/PostCard';
import { MessageCircle, Instagram, Twitter, Flag } from 'lucide-react';
import { motion } from 'motion/react';

export function CreatorProfilePage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const creator = mockCreators.find(c => c.id === creatorId);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!creator) {
    return <div className="p-4">Creator not found</div>;
  }

  const creatorPosts = mockPosts.filter(p => p.creatorId === creator.id);

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-purple-600 to-pink-600">
        <img
          src={creator.cover}
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <Avatar className="w-32 h-32 border-4 border-black">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-20 md:pt-16">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl mb-1">{creator.displayName}</h1>
                  <p className="text-zinc-400 mb-2">@{creator.username}</p>
                  
                  <div className="flex gap-4 text-sm mb-3">
                    <div>
                      <span className="font-semibold">{creator.subscriberCount.toLocaleString()}</span>
                      <span className="text-zinc-400"> subscribers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{creator.postCount}</span>
                      <span className="text-zinc-400"> posts</span>
                    </div>
                    <div>
                      <span className="font-semibold">{creator.mediaCount}</span>
                      <span className="text-zinc-400"> media</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {creator.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  {!isSubscribed ? (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setIsSubscribed(true)}
                        className="w-full md:w-48 bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        Subscribe ${creator.subscriptionPrice}/mo
                      </Button>
                    </motion.div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full md:w-48"
                      size="lg"
                      disabled
                    >
                      ✓ Subscribed
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full md:w-48"
                    size="lg"
                    asChild
                  >
                    <Link to={`/chat/${creator.id}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-zinc-800 rounded-none h-auto p-0">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
            >
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-4">
            {creatorPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creatorPosts.filter(p => p.images.length > 0).map(post => (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <Card className="relative aspect-square overflow-hidden bg-zinc-900 border-zinc-800 hover:ring-2 hover:ring-blue-500 transition-all">
                    <img
                      src={post.images[0]}
                      alt="Media"
                      className={`w-full h-full object-cover ${post.isLocked ? 'blur-xl' : ''}`}
                    />
                    {post.isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Badge className="bg-blue-600">
                          {post.lockType === 'ppv' ? `$${post.price}` : 'Subscribe'}
                        </Badge>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl mb-4">About</h3>
              <p className="text-zinc-300 mb-6">{creator.bio}</p>

              {(creator.socialLinks.instagram || creator.socialLinks.twitter) && (
                <>
                  <h3 className="text-xl mb-3">Social Links</h3>
                  <div className="space-y-2 mb-6">
                    {creator.socialLinks.instagram && (
                      <a
                        href="#"
                        className="flex items-center gap-2 text-zinc-300 hover:text-blue-500"
                      >
                        <Instagram className="w-5 h-5" />
                        {creator.socialLinks.instagram}
                      </a>
                    )}
                    {creator.socialLinks.twitter && (
                      <a
                        href="#"
                        className="flex items-center gap-2 text-zinc-300 hover:text-blue-500"
                      >
                        <Twitter className="w-5 h-5" />
                        {creator.socialLinks.twitter}
                      </a>
                    )}
                  </div>
                </>
              )}

              <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                <Flag className="w-4 h-4 mr-2" />
                Report Profile
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
