'use client';

import { useState, useEffect, useMemo } from 'react';
import { documents, documentContentStore, type Document } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';

const renderWithHighlights = (text: string, highlights: string[]) => {
    if (!text) {
        return <p></p>;
    }
    if (!highlights || !highlights.length) {
        return <p>{text}</p>;
    }
    const regex = new RegExp(`(${highlights.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
        <p>
            {parts.map((part, index) =>
                highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
                    <u key={index}>{part}</u>
                ) : (
                    part
                )
            )}
        </p>
    );
};

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [doc, setDoc] = useState<Document | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [manualHighlights, setManualHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [isHighlightDialogOpen, setIsHighlightDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const docToLoad = documents.find(d => d.id === id);

    if (docToLoad) {
        setDoc(docToLoad);
        if (documentContentStore[docToLoad.id]) {
            setContent(documentContentStore[docToLoad.id]);
        } else {
             const placeholderContent = `${docToLoad.title}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with more details, examples, and explanations related to "${docToLoad.title}".`;
             documentContentStore[docToLoad.id] = placeholderContent;
             setContent(placeholderContent);
        }
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
    
    setIsEditing(false);

    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Document Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 500);
  };

  const handleAddManualHighlight = () => {
    if (newHighlight.trim() && content.includes(newHighlight.trim())) {
      setManualHighlights([...manualHighlights, newHighlight.trim()]);
      setNewHighlight('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Highlight Not Found',
        description: 'The highlighted text must exist exactly as written in the document content.',
      })
    }
  };

  const handleRemoveManualHighlight = (index: number) => {
    setManualHighlights(manualHighlights.filter((_, i) => i !== index));
  };
  
  const renderedContent = useMemo(() => renderWithHighlights(content, manualHighlights), [content, manualHighlights]);


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
            {isEditing ? (
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-[400px] resize-none font-headline text-lg leading-relaxed"
                    aria-label="Document content"
                />
            ) : (
                <div className="h-[400px] overflow-auto rounded-md border p-3 font-headline text-lg leading-relaxed whitespace-pre-wrap">
                    {renderedContent}
                </div>
            )}
        </CardContent>
        <CardFooter className="gap-2">
             {isEditing ? (
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            ) : (
                 <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            )}
            <Button onClick={() => setIsHighlightDialogOpen(true)} variant="outline">
                Manage Highlights
            </Button>
        </CardFooter>
      </Card>
       <Dialog open={isHighlightDialogOpen} onOpenChange={setIsHighlightDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Highlights</DialogTitle>
            <DialogDescription>
              Manage your custom highlights for this document.
            </DialogDescription>
          </DialogHeader>
           <div className="py-4 min-h-[200px]">
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
                            <li key={index} className="font-headline flex items-center justify-between p-2 rounded-md hover:bg-muted">
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
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
