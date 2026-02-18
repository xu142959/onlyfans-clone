import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Image, Video, X, Upload } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
  thumbnail?: string;
}

interface MediaUploaderProps {
  mediaItems: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  onImageEdit?: (item: MediaItem) => void;
  maxItems?: number;
}

export function MediaUploader({ 
  mediaItems, 
  onMediaChange, 
  onImageEdit, 
  maxItems = 10 
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMediaItems = [...mediaItems];
    let addedCount = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && newMediaItems.length < maxItems) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          const newMedia: MediaItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            url: imageUrl,
            file: file,
          };
          
          if (newMediaItems.length < maxItems) {
            newMediaItems.push(newMedia);
            addedCount++;
            
            if (addedCount === files.length || newMediaItems.length >= maxItems) {
              onMediaChange(newMediaItems);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (file && file.type.startsWith('video/') && mediaItems.length < maxItems) {
      const videoUrl = URL.createObjectURL(file);
      const newMedia: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'video',
        url: videoUrl,
        file: file,
      };
      
      onMediaChange([...mediaItems, newMedia]);
    }
  };

  // Remove media item
  const removeMedia = (id: string) => {
    onMediaChange(mediaItems.filter((item) => item.id !== id));
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files) return;

    const newMediaItems = [...mediaItems];

    Array.from(files).forEach((file) => {
      if (newMediaItems.length >= maxItems) return;
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          const newMedia: MediaItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            url: imageUrl,
            file: file,
          };
          newMediaItems.push(newMedia);
          onMediaChange(newMediaItems);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        const newMedia: MediaItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'video',
          url: videoUrl,
          file: file,
        };
        newMediaItems.push(newMedia);
        onMediaChange(newMediaItems);
      }
    });
  };

  return (
    <div className="space-y-3">
      <Label>媒体</Label>
      
      {/* Display uploaded media */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt="上传"
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ) : (
                <div className="relative w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="视频缩略图"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                      <Video className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {item.type === 'image' && onImageEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => onImageEdit(item)}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    编辑
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-600"
                  onClick={() => removeMedia(item.id)}
                >
                  <X className="w-3 h-3 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      {mediaItems.length < maxItems && (
        <div 
          className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700'} rounded-lg p-6 mb-3`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-10 h-10 text-zinc-500 mb-3" />
            <p className="text-zinc-400 mb-4">
              {isDragging ? '将文件拖放到此处上传' : '将文件拖放到此处或点击浏览'}
            </p>
            <div className="flex gap-2 w-full max-w-md">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-700 w-full"
                  asChild
                >
                  <span>
                    <Image className="w-4 h-4 mr-2" />
                    添加照片
                  </span>
                </Button>
              </label>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-700 w-full"
                  asChild
                >
                  <span>
                    <Video className="w-4 h-4 mr-2" />
                    添加视频
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500">
        {mediaItems.length >= maxItems 
          ? `已达到最大媒体数量 ${maxItems}` 
          : `您最多可以上传 ${maxItems} 个媒体文件`}
      </p>
    </div>
  );
}

export default MediaUploader;