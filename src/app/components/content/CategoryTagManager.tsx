import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';

interface CategoryTagManagerProps {
  categories: string[];
  tags: string[];
  onCategoriesChange: (categories: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  availableCategories?: string[];
  maxCategories?: number;
  maxTags?: number;
}

export function CategoryTagManager({ 
  categories, 
  tags, 
  onCategoriesChange, 
  onTagsChange, 
  availableCategories = ['艺术', '美容', '健身', '游戏', '音乐', '摄影', '旅行', '其他'],
  maxCategories = 3,
  maxTags = 5 
}: CategoryTagManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // Add category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory) && categories.length < maxCategories) {
      onCategoriesChange([...categories, newCategory]);
      setNewCategory('');
    }
  };

  // Remove category
  const handleRemoveCategory = (category: string) => {
    onCategoriesChange(categories.filter(c => c !== category));
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
      onTagsChange([...tags, newTag]);
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  // Handle keyboard events
  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="mb-2 block">分类</Label>
        <div className="space-y-3">
          {/* Selected categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category, index) => (
                <Badge key={index} className="bg-blue-500/10 text-blue-400 border-blue-500/30 px-3 py-1">
                  {category}
                  <button 
                    className="ml-2 text-blue-400 hover:text-blue-300"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add category */}
          {categories.length < maxCategories && (
            <div className="flex gap-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleCategoryKeyPress}
                placeholder="添加分类"
                className="bg-zinc-800 border-zinc-700"
              />
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Available categories */}
          <div className="flex flex-wrap gap-2">
            {availableCategories
              .filter(cat => !categories.includes(cat))
              .map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (categories.length < maxCategories) {
                      onCategoriesChange([...categories, category]);
                    }
                  }}
                  disabled={categories.length >= maxCategories}
                  className="border-zinc-700 text-zinc-300"
                >
                  {category}
                </Button>
              ))}
          </div>

          <p className="text-xs text-zinc-500">
            {categories.length >= maxCategories 
              ? `已达到最大分类数 ${maxCategories}` 
              : `您最多可以添加 ${maxCategories} 个分类`}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="mb-2 block">标签</Label>
        <div className="space-y-3">
          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge key={index} className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1">
                  #{tag}
                  <button 
                    className="ml-2 text-green-400 hover:text-green-300"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add tag */}
          {tags.length < maxTags && (
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="添加标签"
                className="bg-zinc-800 border-zinc-700"
              />
              <Button 
                onClick={handleAddTag}
                disabled={!newTag}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          <p className="text-xs text-zinc-500">
            {tags.length >= maxTags 
              ? `已达到最大标签数 ${maxTags}` 
              : `您最多可以添加 ${maxTags} 个标签`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryTagManager;