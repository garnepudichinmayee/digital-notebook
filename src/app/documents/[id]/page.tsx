'use client';

import { useState, useEffect } from 'react';
import { documents } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState(() => documents.find((d) => d.id === params.id));
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const docToLoad = documents.find((d) => d.id === params.id);
    if (docToLoad) {
      setDoc(docToLoad);
      const fullContent = `${docToLoad.excerpt}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "${docToLoad.title}".`;
      setContent(fullContent);
    }
  }, [params.id]);

  useEffect(() => {
    if(!doc) {
      notFound();
    }
  }, [doc]);

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, you would save this to a database.
    // Here we'll just simulate it.
    console.log('Saving content:', content);
    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Document Saved!",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };

  if (!doc) {
    return null; // or a loading indicator
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{doc.title}</CardTitle>
          <CardDescription className="text-lg">Subject: {doc.subject} | Last Modified: {doc.lastModified}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-[400px] resize-none font-headline text-lg leading-relaxed"
                aria-label="Document content"
            />
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
