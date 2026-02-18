import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop as CropIcon,
  Sun,
  Contrast,
  Palette,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (editedImage: string) => void;
}

export function ImageEditor({ isOpen, onClose, imageSrc, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [scale, setScale] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);


  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setScale(1);
    setCrop(undefined);
  };

  const applyFilters = useCallback(() => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imgRef.current;
    
    // Set canvas size based on rotation
    if (rotation % 180 === 0) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    } else {
      canvas.width = image.naturalHeight;
      canvas.height = image.naturalWidth;
    }

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    
    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    ctx.drawImage(
      image,
      -image.naturalWidth / 2,
      -image.naturalHeight / 2,
      image.naturalWidth,
      image.naturalHeight
    );
    
    ctx.restore();

    return canvas;
  }, [brightness, contrast, saturation, rotation, scale]);

  const handleSave = async () => {
    setProcessing(true);
    
    try {
      let canvas: HTMLCanvasElement | undefined;

      if (completedCrop && imgRef.current) {
        // If there's a crop, apply it
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        
        ctx.drawImage(
          image,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } else {
        // Apply filters and transformations without crop
        canvas = applyFilters();
      }

      if (!canvas) throw new Error('Failed to create canvas');

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to process image');
          setProcessing(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        onSave(url);
        toast.success('Image saved successfully!');
        onClose();
        setProcessing(false);
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
      setProcessing(false);
    }
  };

  const imageStyle: React.CSSProperties = {
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transition: 'transform 0.3s ease',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="crop" className="w-full">
          <TabsList className="bg-zinc-800 border border-zinc-700 w-full grid grid-cols-3">
            <TabsTrigger value="crop">
              <CropIcon className="w-4 h-4 mr-2" />
              Crop
            </TabsTrigger>
            <TabsTrigger value="adjust">
              <Sun className="w-4 h-4 mr-2" />
              Adjust
            </TabsTrigger>
            <TabsTrigger value="filters">
              <Palette className="w-4 h-4 mr-2" />
              Filters
            </TabsTrigger>
          </TabsList>

          {/* Crop Tab */}
          <TabsContent value="crop" className="space-y-4">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleRotate}
                variant="outline"
                size="sm"
                className="border-zinc-700"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
              <Button
                onClick={handleZoomIn}
                variant="outline"
                size="sm"
                className="border-zinc-700"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom In
              </Button>
              <Button
                onClick={handleZoomOut}
                variant="outline"
                size="sm"
                className="border-zinc-700"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                Zoom Out
              </Button>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-center overflow-hidden max-h-[400px]">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Edit"
                  style={imageStyle}
                  className="max-w-full max-h-[400px]"
                />
              </ReactCrop>
            </div>
          </TabsContent>

          {/* Adjust Tab */}
          <TabsContent value="adjust" className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-4 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Brightness
                  </label>
                  <span className="text-sm text-zinc-400">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(v) => setBrightness(v[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Contrast className="w-4 h-4" />
                    Contrast
                  </label>
                  <span className="text-sm text-zinc-400">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(v) => setContrast(v[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Saturation
                  </label>
                  <span className="text-sm text-zinc-400">{saturation}%</span>
                </div>
                <Slider
                  value={[saturation]}
                  onValueChange={(v) => setSaturation(v[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-center overflow-hidden max-h-[300px]">
              <img
                src={imageSrc}
                alt="Preview"
                style={imageStyle}
                className="max-w-full max-h-[300px]"
              />
            </div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Original', brightness: 100, contrast: 100, saturation: 100 },
                { name: 'Vivid', brightness: 110, contrast: 120, saturation: 140 },
                { name: 'Soft', brightness: 105, contrast: 90, saturation: 80 },
                { name: 'Dramatic', brightness: 95, contrast: 140, saturation: 110 },
                { name: 'B&W', brightness: 100, contrast: 120, saturation: 0 },
                { name: 'Vintage', brightness: 110, contrast: 90, saturation: 70 },
              ].map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => {
                    setBrightness(filter.brightness);
                    setContrast(filter.contrast);
                    setSaturation(filter.saturation);
                  }}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 hover:border-blue-500 transition-colors"
                >
                  <div className="aspect-square bg-zinc-900 rounded mb-2 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={filter.name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%)`,
                      }}
                    />
                  </div>
                  <p className="text-sm">{filter.name}</p>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t border-zinc-800">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="border-zinc-700"
          >
            Reset
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-zinc-700"
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}