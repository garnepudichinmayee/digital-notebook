'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateTextFromNote } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

export function NoteConverterView() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const noteImage = PlaceHolderImages.find((img) => img.id === 'handwritten-note');

  const handleConversion = () => {
    if (!noteImage) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await generateTextFromNote(noteImage.imageUrl);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Handwriting to Text Converter</CardTitle>
        <CardDescription>
          Use our AI-powered tool to transform your handwritten notes into digital text.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Your Handwritten Note</h3>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
            {noteImage ? (
              <Image
                src={noteImage.imageUrl}
                alt={noteImage.description}
                fill
                className="object-cover"
                data-ai-hint={noteImage.imageHint}
              />
            ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                    <p>No image available</p>
                </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Converted Text</h3>
             <div className="relative flex-grow">
                {isPending ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 rounded-lg border border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Converting your note...</p>
                </div>
                ) : error ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Conversion Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                ) : result ? (
                    <Textarea
                        readOnly
                        value={result.text}
                        className="h-full resize-none font-headline text-base"
                        aria-label="Converted Text"
                    />
                ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center rounded-lg border border-dashed">
                    <Wand2 className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">The converted text will appear here.</p>
                </div>
                )}
             </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConversion} disabled={isPending || !noteImage}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Convert to Text
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
