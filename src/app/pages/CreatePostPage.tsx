import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Upload, 
 
  Clock, 
  Check, 
  X, 
  Video, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ImageEditor } from '../components/ImageEditor';
import { VideoProcessor } from '../components/VideoProcessor';
import { SchedulePostModal } from '../components/SchedulePostModal';
import { MediaUploader, VisibilitySettings, CategoryTagManager } from '../components/content';
import { contentService } from '../../api/services/contentService';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  file?: File;
  thumbnail?: string;
}

export function CreatePostPage() {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'free' | 'subscription' | 'ppv'>('subscription');
  const [price, setPrice] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [videoProcessorOpen, setVideoProcessorOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<string | null>(null);
  const [selectedVideoForProcess, setSelectedVideoForProcess] = useState<File | null>(null);
  
  const navigate = useNavigate();





  // Handle edited image save
  const handleImageSave = (editedImageUrl: string) => {
    if (selectedImageForEdit) {
      setMediaItems((prev) =>
        prev.map((item) =>
          item.url === selectedImageForEdit
            ? { ...item, url: editedImageUrl }
            : item
        )
      );
      toast.success('Image edited successfully!');
    }
    setImageEditorOpen(false);
    setSelectedImageForEdit(null);
  };

  // Handle processed video save
  const handleVideoProcess = (processedVideo: Blob) => {
    const videoUrl = URL.createObjectURL(processedVideo);
    const newMedia: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'video',
      url: videoUrl,
      thumbnail: videoUrl, // 使用视频URL作为临时缩略图
    };
    setMediaItems((prev) => [...prev, newMedia]);
    setVideoProcessorOpen(false);
    setSelectedVideoForProcess(null);
    toast.success('Video processed successfully!');
  };



  // Handle schedule
  const handleSchedule = (date: Date) => {
    setScheduledDate(date);
    setScheduleModalOpen(false);
    toast.success(`内容已安排在 ${date.toLocaleString()}`);
  };

  // Publish post
  const handlePost = async () => {
    if (!content.trim() && mediaItems.length === 0) {
      toast.error('请添加一些内容或媒体到您的帖子');
      return;
    }

    if (visibility === 'ppv' && (!price || parseFloat(price) <= 0)) {
      toast.error('请为按次付费内容设置有效的价格');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare media items for API
      const media = mediaItems.map(item => ({
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail,
        caption: ''
      }));

      // Create content
      await contentService.createContent({
        title: content.substring(0, 100), // Use first 100 chars as title
        content,
        media,
        visibility,
        price: visibility === 'ppv' ? parseFloat(price) : 0,
        scheduledAt: scheduledDate,
        categories,
        tags
      });

      const action = scheduledDate ? '安排' : '发布';
      toast.success(`内容${action}成功！`, {
        description: scheduledDate 
          ? `将在 ${scheduledDate.toLocaleString()} 发布` 
          : '您的内容现已上线',
      });
      
      navigate('/creator-dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('创建内容失败，请重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">创建新内容</h2>
        <p className="text-zinc-400">与您的订阅者分享内容</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 p-6">
        {/* Content Input */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="content">内容</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="你在想什么？与你的粉丝分享一些内容..."
            className="bg-zinc-800 border-zinc-700 min-h-32"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {content.length}/5000 字符
            </p>
            {content.length > 4500 && (
              <Badge variant="outline" className="text-orange-500 border-orange-500">
                还可输入 {5000 - content.length} 字符
              </Badge>
            )}
          </div>
        </div>

        {/* Media Upload with Advanced Features */}
        <div className="mb-6">
          <MediaUploader 
            mediaItems={mediaItems}
            onMediaChange={setMediaItems}
            onImageEdit={(item) => {
              setSelectedImageForEdit(item.url);
              setImageEditorOpen(true);
            }}
          />
        </div>

        {/* Visibility Settings */}
        <div className="mb-6">
          <VisibilitySettings 
            visibility={visibility}
            price={price}
            onVisibilityChange={setVisibility}
            onPriceChange={setPrice}
          />
        </div>

        {/* Category and Tag Management */}
        <div className="mb-6">
          <CategoryTagManager 
            categories={categories}
            tags={tags}
            onCategoriesChange={setCategories}
            onTagsChange={setTags}
          />
        </div>

        {/* Schedule Section */}
        <div className="space-y-2 mb-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              安排发布（可选）
            </Label>
            {scheduledDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setScheduledDate(null)}
              >
                <X className="w-3 h-3 mr-1" />
                清除
              </Button>
            )}
          </div>
          
          {scheduledDate ? (
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-500" />
                <span className="text-blue-400">
                  已安排在 {scheduledDate.toLocaleString()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScheduleModalOpen(true)}
              >
                编辑
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="border-zinc-700 w-full"
              onClick={() => setScheduleModalOpen(true)}
            >
              <Clock className="w-4 h-4 mr-2" />
              设置安排
            </Button>
          )}
          
          <p className="text-xs text-zinc-500">
            安排您的内容在特定日期和时间发布
          </p>
        </div>

        {/* Preview */}
        {(content || mediaItems.length > 0) && (
          <div className="mb-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <Label className="mb-3 block">预览</Label>
            <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
              {content && (
                <p className="text-sm mb-3 whitespace-pre-wrap">{content}</p>
              )}
              {mediaItems.length > 0 && (
                <div className={`grid gap-2 ${
                  mediaItems.length === 1 ? 'grid-cols-1' : 
                  mediaItems.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-2'
                }`}>
                  {mediaItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt="预览"
                          className="w-full aspect-square object-cover rounded"
                        />
                      ) : (
                        <div className="relative w-full aspect-square bg-zinc-800 rounded">
                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt="视频预览"
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                              <Video className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs">
                {visibility !== 'free' && (
                  <span className={`px-2 py-1 rounded ${
                    visibility === 'subscription'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {visibility === 'subscription' ? '仅限订阅者' : `$${price || '0.00'}`}
                  </span>
                )}
                {scheduledDate && (
                  <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    已安排
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/creator-dashboard')}
            variant="outline"
            className="border-zinc-700"
          >
            取消
          </Button>
          <Button
            onClick={handlePost}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {scheduledDate ? '安排中...' : '发布中...'}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {scheduledDate ? '安排发布' : '发布内容'}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Tips Card */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mt-4">
        <h3 className="text-lg mb-3">💡 提高互动的小贴士</h3>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>使用图片编辑器在发布前增强您的照片效果</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>视频会自动优化以实现更快的加载速度</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>在互动高峰期安排发布（查看分析数据）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>混合免费和独家内容以吸引新订阅者</span>
          </li>
        </ul>
      </Card>

      {/* Modals */}
      {selectedImageForEdit && (
        <ImageEditor
          isOpen={imageEditorOpen}
          onClose={() => {
            setImageEditorOpen(false);
            setSelectedImageForEdit(null);
          }}
          imageSrc={selectedImageForEdit}
          onSave={handleImageSave}
        />
      )}

      {selectedVideoForProcess && (
        <VideoProcessor
          isOpen={videoProcessorOpen}
          onClose={() => {
            setVideoProcessorOpen(false);
            setSelectedVideoForProcess(null);
          }}
          videoFile={selectedVideoForProcess}
          onProcess={handleVideoProcess}
        />
      )}

      <SchedulePostModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        postContent={content}
        postImages={mediaItems.filter(m => m.type === 'image').map(m => m.url)}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
