import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search as SearchIcon, TrendingUp } from 'lucide-react';
import { mockCreators } from '../data/mockData';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockCreators);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setResults(mockCreators);
    } else {
      const filtered = mockCreators.filter(
        creator =>
          creator.displayName.toLowerCase().includes(query.toLowerCase()) ||
          creator.username.toLowerCase().includes(query.toLowerCase()) ||
          creator.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    }
  };

  const popularTags = ['Fitness', 'Fashion', 'Art', 'Photography', 'Lifestyle', 'Wellness'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search creators, tags..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800"
          />
        </div>
      </div>

      {/* Popular Tags */}
      {searchQuery === '' && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg">Popular Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => handleSearch(tag)}
                className="rounded-full"
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        <h3 className="text-lg mb-3">
          {searchQuery ? `Results for "${searchQuery}"` : 'Suggested Creators'}
        </h3>
        
        {results.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            <p className="text-zinc-400">No creators found</p>
          </Card>
        ) : (
          results.map((creator) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to={`/creator/${creator.id}`}>
                <Card className="bg-zinc-900 border-zinc-800 p-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={creator.avatar} alt={creator.displayName} />
                      <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{creator.displayName}</h4>
                      <p className="text-sm text-zinc-400 mb-2">@{creator.username}</p>
                      <p className="text-sm text-zinc-300 line-clamp-2 mb-2">{creator.bio}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {creator.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span>{creator.subscriberCount.toLocaleString()} subscribers</span>
                        <span>{creator.postCount} posts</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-500">
                        ${creator.subscriptionPrice}/mo
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
