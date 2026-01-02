'use client';

import { useState, useEffect, useTransition, use } from 'react';
import { documents, type Document } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { generateHighlights } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// A mock in-memory store. In a real app, you'd use a database.
const documentStore: { [key: string]: Document } = {};
documents.forEach(doc => {
    const fullContent = `${doc.excerpt}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "${doc.title}".`;
    documentStore[doc.id] = { ...doc, excerpt: fullContent };
});


export default function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const [doc, setDoc] = useState<Document | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHighlighting, startHighlightTransition] = useTransition();
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightError, setHighlightError] = useState<string | null>(null);
  const [isHighlightDialogOpen, setIsHighlightDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const docToLoad = documentStore[id];

    if (docToLoad) {
      setDoc(docToLoad);
      setContent(docToLoad.excerpt);
    } else {
        notFound();
    }
    setIsLoading(false);
  }, [id]);

  const handleSave = () => {
    if (!doc) return;
    setIsSaving(true);
    
    // Update our mock store
    documentStore[doc.id] = { ...doc, excerpt: content, lastModified: new Date().toISOString().split('T')[0] };

    setTimeout(() => {
        setIsSaving(false);
        setDoc(documentStore[doc.id]); // Refresh state
        toast({
            title: "Document Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };
  
  const handleHighlight = () => {
    setHighlights([]);
    setHighlightError(null);
    setIsHighlightDialogOpen(true);
    startHighlightTransition(async () => {
      const result = await generateHighlights(content);
      if (result.success && result.data) {
        setHighlights(result.data.points);
      } else {
        setHighlightError(result.error || 'An unknown error occurred.');
      }
    });
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-[400px] w-full" />
                </CardContent>
                <CardFooter className="gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!doc) {
    return null; 
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{doc.title}</CardTitle>
          <CardDescription className="text-lg">Subject: {doc.subject} | Last Modified: {doc.lastModified}</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-[400px] resize-none font-headline text-lg leading-relaxed"
                aria-label="Document content"
            />
        </CardContent>
        <CardFooter className="gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
             <Button onClick={handleHighlight} variant="outline" disabled={isHighlighting}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isHighlighting ? 'Analyzing...' : 'Highlight Points'}
            </Button>
        </CardFooter>
      </Card>
       <Dialog open={isHighlightDialogOpen} onOpenChange={setIsHighlightDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Key Points</DialogTitle>
            <DialogDescription>
              Here are the key points our AI found in your document.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isHighlighting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Generating highlights...</p>
              </div>
            ) : highlightError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Highlighting Failed</AlertTitle>
                <AlertDescription>{highlightError}</AlertDescription>
              </Alert>
            ) : highlights.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside">
                {highlights.map((point, index) => (
                  <li key={index} className="font-headline">{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">No key points were found to highlight.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
