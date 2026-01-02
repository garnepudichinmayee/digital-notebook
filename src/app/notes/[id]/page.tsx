'use client';

import { useState, useEffect } from 'react';
import { notes, type Note } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


// A mock in-memory store. In a real app, you'd use a database.
const noteStore: { [key: string]: Note } = {};
notes.forEach(note => {
    const fullContent = `${note.excerpt}\n\nThis is a placeholder for the full note content. You can expand on the excerpt here with more details, examples, and explanations related to "${note.title}".`;
    noteStore[note.id] = { ...note, excerpt: fullContent };
});


export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const noteToLoad = noteStore[params.id];
    if (noteToLoad) {
      setNote(noteToLoad);
      setContent(noteToLoad.excerpt); // excerpt now holds full content
    } else {
        const initialNote = notes.find((n) => n.id === params.id);
        if(initialNote) {
            const fullContent = `${initialNote.excerpt}\n\nThis is a placeholder for the full note content. You can expand on the excerpt here with more details, examples, and explanations related to "${initialNote.title}".`;
            noteStore[initialNote.id] = {...initialNote, excerpt: fullContent};
            setNote(noteStore[initialNote.id]);
            setContent(fullContent);
        }
    }
  }, [params.id]);

  useEffect(() => {
    if(!note) {
        notFound();
    }
  }, [note]);


  const handleSave = () => {
    if (!note) return;
    setIsSaving(true);
    
    // Update our mock store
    noteStore[note.id] = { ...note, excerpt: content, lastModified: new Date().toISOString().split('T')[0] };

    setTimeout(() => {
        setIsSaving(false);
        setNote(noteStore[note.id]); // Refresh component state
        toast({
            title: "Note Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };
  
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
            <CardContent className="flex flex-col gap-4">
                 <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-[400px] resize-none font-headline text-lg leading-relaxed"
                    aria-label="Note content"
                />
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
