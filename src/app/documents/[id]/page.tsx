'use client';

import { useState, useEffect, useTransition, use } from 'react';
import { documents, documentContentStore, type Document } from '@/lib/data';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const id = use(params).id;
  const [doc, setDoc] = useState<Document | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isHighlighting, startHighlightTransition] = useTransition();
  const [aiHighlights, setAiHighlights] = useState<string[]>([]);
  const [manualHighlights, setManualHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [highlightError, setHighlightError] = useState<string | null>(null);
  const [isHighlightDialogOpen, setIsHighlightDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const docToLoad = documents.find(d => d.id === id);

    if (docToLoad) {
      setDoc(docToLoad);
      // Ensure the store has initial content if it hasn't been created yet
      if (!documentContentStore[docToLoad.id]) {
        documentContentStore[docToLoad.id] = `${docToLoad.excerpt}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "${docToLoad.title}".`;
      }
      // Always load the latest content from the store
      setContent(documentContentStore[docToLoad.id]);
      setManualHighlights(docToLoad.manualHighlights || []);
    } else {
        notFound();
    }
    setIsLoading(false);
  }, [id]);

  const handleSave = () => {
    if (!doc) return;
    setIsSaving(true);
    
    documentContentStore[doc.id] = content;

    const docIndex = documents.findIndex(d => d.id === doc.id);
    if (docIndex !== -1) {
        documents[docIndex].excerpt = content.substring(0, 100) + (content.length > 100 ? '...' : '');
        documents[docIndex].lastModified = new Date().toISOString().split('T')[0];
        documents[docIndex].manualHighlights = manualHighlights;
    }

    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Document Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };
  
  const handleAiHighlight = () => {
    setAiHighlights([]);
    setHighlightError(null);
    setIsHighlightDialogOpen(true);
    startHighlightTransition(async () => {
      const result = await generateHighlights(content);
      if (result.success && result.data) {
        setAiHighlights(result.data.points);
      } else {
        setHighlightError(result.error || 'An unexpected error occurred.');
      }
    });
  };

  const handleAddManualHighlight = () => {
    if (newHighlight.trim()) {
      setManualHighlights([...manualHighlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveManualHighlight = (index: number) => {
    setManualHighlights(manualHighlights.filter((_, i) => i !== index));
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
             <Button onClick={handleAiHighlight} variant="outline" disabled={isHighlighting}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isHighlighting ? 'Analyzing...' : 'AI Highlights'}
            </Button>
            <Button onClick={() => setIsHighlightDialogOpen(true)} variant="outline">
                Highlights
            </Button>
        </CardFooter>
      </Card>
       <Dialog open={isHighlightDialogOpen} onOpenChange={setIsHighlightDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Key Points</DialogTitle>
            <DialogDescription>
              Manage AI-generated and manual highlights for your document.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai" onClick={handleAiHighlight}>AI Generated</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="py-4 min-h-[200px]">
                 {isHighlighting ? (
                    <div className="flex items-center justify-center gap-2 h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">Generating highlights...</p>
                    </div>
                    ) : highlightError ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Highlighting Failed</AlertTitle>
                        <AlertDescription>{highlightError}</AlertDescription>
                    </Alert>
                    ) : aiHighlights.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside">
                        {aiHighlights.map((point, index) => (
                        <li key={index} className="font-headline">{point}</li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-center text-muted-foreground h-full flex items-center justify-center">No key points were found to highlight.</p>
                    )}
            </TabsContent>
            <TabsContent value="manual" className="py-4 min-h-[200px]">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                         <Input 
                            value={newHighlight}
                            onChange={(e) => setNewHighlight(e.target.value)}
                            placeholder="Add a new highlight"
                        />
                        <Button onClick={handleAddManualHighlight} size="icon">
                            <Plus className="h-4 w-4"/>
                        </Button>
                    </div>
                    {manualHighlights.length > 0 ? (
                        <ul className="space-y-2">
                            {manualHighlights.map((point, index) => (
                            <li key={index} className="font-headline flex items-center justify-between p-3">
                                <span className="underline">{point}</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveManualHighlight(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-muted-foreground pt-8">No manual highlights yet.</p>
                    )}
                </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
