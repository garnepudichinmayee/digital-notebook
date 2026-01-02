'use client';

import { useState, useEffect, use, useMemo } from 'react';
import { notes, noteContentStore, type Note } from '@/lib/data';
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
    if (!highlights || !highlights.length) {
        return <p>{text}</p>;
    }
    // Escape special characters for regex
    const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
        <p>
            {parts.map((part, index) =>
                escapedHighlights.some(h => new RegExp(`^${h}$`, 'i').test(part)) ? <u key={index}>{part}</u> : part
            )}
        </p>
    );
};


export default function NotePage({ params }: { params: { id: string } }) {
  const id = use(params).id;
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [manualHighlights, setManualHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [isHighlightDialogOpen, setIsHighlightDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const noteToLoad = notes.find(n => n.id === id);

    if (noteToLoad) {
      setNote(noteToLoad);
      const existingContent = noteContentStore[noteToLoad.id];
      if (existingContent) {
        setContent(existingContent);
      } else {
        const placeholderContent = `${noteToLoad.excerpt}\n\nThis is a placeholder for the full note content. You can expand on the excerpt here with more details, examples, and explanations related to "${noteToLoad.title}".`;
        noteContentStore[noteToLoad.id] = placeholderContent;
        setContent(placeholderContent);
      }
      setManualHighlights(noteToLoad.manualHighlights || []);
    } else {
        notFound();
    }
    setIsLoading(false);
  }, [id]);

  const handleSave = () => {
    if (!note) return;
    setIsSaving(true);
    
    noteContentStore[note.id] = content;
    
    const noteIndex = notes.findIndex(n => n.id === note.id);
    if (noteIndex !== -1) {
        notes[noteIndex].excerpt = content.substring(0, 100) + (content.length > 100 ? '...' : '');
        notes[noteIndex].lastModified = new Date().toISOString().split('T')[0];
        notes[noteIndex].manualHighlights = manualHighlights;
    }
    
    setIsEditing(false);

    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Note Saved!",
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
        description: 'The highlighted text must exist exactly as written in the note content.',
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
                <CardContent>
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

  if (!note) {
    return null;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">{note.title}</CardTitle>
                <CardDescription className="text-lg">Subject: {note.subject} | Last Modified: {note.lastModified}</CardDescription>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-[400px] resize-none font-headline text-lg leading-relaxed"
                        aria-label="Note content"
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
                    Manage your custom highlights for this note.
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
