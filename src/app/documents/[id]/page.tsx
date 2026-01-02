'use client';

import { useState, useEffect } from 'react';
import { documents, type Document } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// A mock in-memory store. In a real app, you'd use a database.
const documentStore: { [key: string]: Document } = {};
documents.forEach(doc => {
    const fullContent = `${doc.excerpt}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "${doc.title}".`;
    documentStore[doc.id] = { ...doc, excerpt: fullContent };
});


export default function DocumentPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<Document | undefined>(undefined);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const docToLoad = documentStore[params.id];
    if (docToLoad) {
      setDoc(docToLoad);
      setContent(docToLoad.excerpt); // now excerpt contains the full content
    } else {
        const initialDoc = documents.find((d) => d.id === params.id);
        if (initialDoc) {
             const fullContent = `${initialDoc.excerpt}\n\nThis is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "${initialDoc.title}".`;
             documentStore[initialDoc.id] = { ...initialDoc, excerpt: fullContent };
             setDoc(documentStore[initialDoc.id]);
             setContent(fullContent);
        }
    }
  }, [params.id]);

  useEffect(() => {
    if(!doc) {
      notFound();
    }
  }, [doc]);

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
