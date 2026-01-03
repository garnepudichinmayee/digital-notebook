'use client';

import { Wand2, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

export function NoteConverterView() {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [convertedText, setConvertedText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const defaultImage = PlaceHolderImages.find(p => p.id === 'handwritten-note');
    if (defaultImage) {
      setImage(defaultImage.imageUrl);
    } else {
      setIsImageLoading(false);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setConvertedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!image) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload an image first.',
      });
      return;
    }
    setIsConverting(true);
    // Simulate AI conversion
    setTimeout(() => {
      setConvertedText(
        'This is a simulation of converted handwritten text. The actual AI model would process the image and return the recognized text here.'
      );
      setIsConverting(false);
      toast({
        title: 'Conversion Complete!',
        description: 'Your handwritten note has been converted to text.',
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Handwriting to Text Converter</CardTitle>
        <CardDescription>
          Upload an image of your handwritten notes to transform them into
          digital text.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Your Handwritten Note</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
            {isImageLoading && !image && (
              <div className="flex items-center justify-center h-full bg-muted">
                <p>Loading image...</p>
              </div>
            )}
             {image ? (
              <Image
                src={image}
                alt="Handwritten note"
                fill
                className="object-cover"
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  toast({
                    variant: 'destructive',
                    title: 'Image Error',
                    description: 'Could not load the image.',
                  });
                }}
              />
            ) : (
               !isImageLoading && <div className="flex items-center justify-center h-full bg-muted">
                <p>Upload an image to get started</p>
              </div>
            )}
             {isImageLoading && image && (
                <Skeleton className="w-full h-full" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Converted Text</h3>
          <div className="relative flex-grow">
            {isConverting ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center rounded-lg border border-dashed">
                <Wand2 className="h-8 w-8 text-muted-foreground animate-pulse" />
                <p className="text-muted-foreground">Converting...</p>
              </div>
            ) : convertedText ? (
              <Textarea
                readOnly
                value={convertedText}
                className="h-full resize-none font-headline"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center rounded-lg border border-dashed">
                <Wand2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  The converted text will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConvert} disabled={!image || isConverting || isImageLoading}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isConverting ? 'Converting...' : 'Convert to Text'}
        </Button>
      </CardFooter>
    </Card>
  );
}
