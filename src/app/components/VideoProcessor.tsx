import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Video,
  Scissors,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoProcessorProps {
  isOpen: boolean;
  onClose: () => void;
  videoFile: File | null;
  onProcess: (processedVideo: Blob) => void;
}

export function VideoProcessor({
  isOpen,
  onClose,
  videoFile,
  onProcess,
}: VideoProcessorProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [volume, setVolume] = useState(100);
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setTrimEnd(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProcess = async () => {
    if (!videoFile) return;

    setProcessing(true);
    setProcessProgress(0);

    // Simulate video processing
    // In a real implementation, you would use FFmpeg.wasm or send to server
    const simulateProgress = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(simulateProgress);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Wait for processing to complete
      await new Promise((resolve) => setTimeout(resolve, 3500));

      // In a real implementation, you would:
      // 1. Load FFmpeg.wasm
      // 2. Apply trim, compression, and other effects
      // 3. Generate the processed video blob
      
      // For now, we'll just return the original file as a blob
      const blob = new Blob([videoFile], { type: videoFile.type });
      
      toast.success('视频处理成功！');
      onProcess(blob);
      onClose();

    } catch (error) {
      console.error('Error processing video:', error);
      toast.error('视频处理失败');
    } finally {
      setProcessing(false);
      clearInterval(simulateProgress);
    }
  };

  const getFileSizeInfo = () => {
    if (!videoFile) return { original: 0, estimated: 0 };
    const originalSize = videoFile.size / (1024 * 1024); // MB
    const compressionRatio = quality / 100;
    const estimatedSize = originalSize * compressionRatio;
    return { original: originalSize, estimated: estimatedSize };
  };

  const { original, estimated } = getFileSizeInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">处理视频</DialogTitle>
          <DialogDescription>
            上传前修剪、压缩和优化您的视频
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList className="bg-zinc-800 border border-zinc-700 grid grid-cols-3">
            <TabsTrigger value="preview">
              <Play className="w-4 h-4 mr-2" />
              预览
            </TabsTrigger>
            <TabsTrigger value="trim">
              <Scissors className="w-4 h-4 mr-2" />
              修剪
            </TabsTrigger>
            <TabsTrigger value="quality">
              <Maximize2 className="w-4 h-4 mr-2" />
              质量
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
              <div className="relative bg-black aspect-video">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">
                    <Video className="w-16 h-16" />
                  </div>
                )}
                
                {/* Play/Pause Overlay */}
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                >
                  {isPlaying ? (
                    <Pause className="w-16 h-16 text-white" />
                  ) : (
                    <Play className="w-16 h-16 text-white" />
                  )}
                </button>
              </div>

              {/* Video Controls */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="h-8 w-8 p-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <div className="flex-1">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                  </div>

                  <span className="text-sm text-zinc-400 min-w-[80px] text-right">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleVolumeChange([volume === 0 ? 100 : 0])}
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>

                  <div className="w-32">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full"
                    />
                  </div>

                  <span className="text-sm text-zinc-400 min-w-[40px]">{volume}%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Trim Tab */}
          <TabsContent value="trim" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>开始时间</Label>
                  <span className="text-sm text-zinc-400">{formatTime(trimStart)}</span>
                </div>
                <Slider
                  value={[trimStart]}
                  max={duration}
                  step={0.1}
                  onValueChange={(v) => {
                    setTrimStart(v[0]);
                    if (videoRef.current) {
                      videoRef.current.currentTime = v[0];
                    }
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>结束时间</Label>
                  <span className="text-sm text-zinc-400">{formatTime(trimEnd)}</span>
                </div>
                <Slider
                  value={[trimEnd]}
                  max={duration}
                  step={0.1}
                  onValueChange={(v) => setTrimEnd(v[0])}
                  className="w-full"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-sm text-zinc-400 mb-1">修剪后时长</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatTime(Math.max(0, trimEnd - trimStart))}
                </p>
              </div>
            </Card>

            <div className="text-sm text-zinc-500">
              💡 提示：修剪可以减小文件大小，帮助您聚焦于内容的最佳部分
            </div>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700 p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>压缩质量</Label>
                  <span className="text-sm text-zinc-400">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  max={100}
                  min={20}
                  step={10}
                  onValueChange={(v) => setQuality(v[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>文件更小</span>
                  <span>质量更好</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-lg p-4 text-center">
                  <p className="text-sm text-zinc-400 mb-2">原始大小</p>
                  <p className="text-2xl font-bold">{original.toFixed(2)} MB</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-4 text-center">
                  <p className="text-sm text-zinc-400 mb-2">估计大小</p>
                  <p className="text-2xl font-bold text-green-400">
                    {estimated.toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">压缩比例</span>
                  <span className="font-semibold">
                    减少 {((1 - estimated / original) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={((1 - estimated / original) * 100)} />
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuality(90)}
                className="border-zinc-700"
              >
                高质量
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuality(70)}
                className="border-zinc-700"
              >
                平衡
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuality(50)}
                className="border-zinc-700"
              >
                高压缩
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Processing Progress */}
        {processing && (
          <Card className="bg-zinc-800 border-zinc-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">正在处理视频...</span>
                <span className="text-sm text-zinc-400">{processProgress}%</span>
              </div>
              <Progress value={processProgress} />
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-zinc-800">
          <Button
            variant="outline"
            className="flex-1 border-zinc-700"
            onClick={onClose}
            disabled={processing}
          >
            取消
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleProcess}
            disabled={processing || !videoFile}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                处理并保存
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-center text-zinc-500">
          💡 处理在您的浏览器中进行 - 您的视频永远不会离开您的设备
        </div>
      </DialogContent>
    </Dialog>
  );
}
