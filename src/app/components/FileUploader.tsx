import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, Upload, Video, File } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  type: 'image' | 'video' | 'other';
}

interface FileUploaderProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesChange?: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
}

export function FileUploader({
  accept = 'image/*,video/*',
  maxFiles = 10,
  maxSize = 100,
  onFilesChange,
  existingFiles = []
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): 'image' | 'video' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'other';
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is ${maxSize}MB`);
        continue;
      }

      // Check max files
      if (files.length + newFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const fileType = getFileType(file);
      let preview = '';

      // Create preview for images and videos
      if (fileType === 'image') {
        preview = URL.createObjectURL(file);
      } else if (fileType === 'video') {
        preview = URL.createObjectURL(file);
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${i}`,
        file,
        preview,
        progress: 0,
        type: fileType
      };

      newFiles.push(uploadedFile);

      // Simulate upload progress
      simulateUpload(uploadedFile.id);
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        toast.success('File uploaded successfully');
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Revoke object URL to free memory
    const file = files.find(f => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
  };

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
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
        
        <p className="text-lg mb-2">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        
        <p className="text-sm text-zinc-500">
          Images and videos up to {maxSize}MB (Max {maxFiles} files)
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
              >
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {file.type === 'image' && (
                      <div className="w-16 h-16 rounded overflow-hidden bg-zinc-900">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {file.type === 'video' && (
                      <div className="w-16 h-16 rounded overflow-hidden bg-zinc-900 flex items-center justify-center">
                        <Video className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                    {file.type === 'other' && (
                      <div className="w-16 h-16 rounded bg-zinc-900 flex items-center justify-center">
                        <File className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-zinc-500">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>

                      <Button
                        onClick={() => removeFile(file.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0 h-8 w-8 p-0 text-zinc-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    {file.progress < 100 ? (
                      <div className="space-y-1">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-zinc-500">
                          Uploading... {file.progress}%
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-green-500">✓ Upload complete</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* File Count */}
      {files.length > 0 && (
        <div className="text-sm text-zinc-500 text-center">
          {files.length} / {maxFiles} files uploaded
        </div>
      )}
    </div>
  );
}
