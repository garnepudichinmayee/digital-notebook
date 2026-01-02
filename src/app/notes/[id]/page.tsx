'use client';

import { useState, useEffect } from 'react';
import { notes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState(() => notes.find((n) => n.id === params.id));
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const noteToLoad = notes.find((n) => n.id === params.id);
    if (noteToLoad) {
      setNote(noteToLoad);
      const fullContent = `${noteToLoad.excerpt}\n\nThis is a placeholder for the full note content. You can expand on the excerpt here with more details, examples, and explanations related to "${noteToLoad.title}".`;
      setContent(fullContent);
    }
  }, [params.id]);

  if (!note) {
    // This will be caught by the notFound() call in a moment, but it helps with type safety.
    // In a real app, you might fetch data here and have a loading state.
  }

  useEffect(() => {
    if(!note) {
        notFound();
    }
  }, [note])


  const handleSave = () => {
    setIsSaving(true);
    // In a real app, you would save this to a database.
    // Here we'll just simulate it.
    console.log('Saving content:', content);
    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Note Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
        {note && <Card className="w-full max-w-3xl">
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
        </Card>}
    </div>
  );
}
