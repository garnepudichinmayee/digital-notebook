'use client';

import { Wand2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function NoteConverterView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Handwriting to Text Converter</CardTitle>
        <CardDescription>
          Use our AI-powered tool to transform your handwritten notes into
          digital text. This feature is currently unavailable.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Your Handwritten Note</h3>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
            <div className="flex items-center justify-center h-full bg-muted">
              <p>No image available</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Converted Text</h3>
          <div className="relative flex-grow">
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center rounded-lg border border-dashed">
              <Wand2 className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                The converted text will appear here.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled>
          <Wand2 className="mr-2 h-4 w-4" />
          Convert to Text
        </Button>
      </CardFooter>
    </Card>
  );
}
