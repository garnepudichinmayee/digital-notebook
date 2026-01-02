'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { folders, notes } from '@/lib/data';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewNotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!title || !content || !subject) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out the title, content, and select a subject.',
      });
      return;
    }

    setIsSaving(true);

    // In a real app, you'd save to a database. Here, we'll just add to our mock data.
    const newNote = {
      id: `n${notes.length + 1}`,
      title,
      type: 'Note' as const,
      subject,
      lastModified: new Date().toISOString().split('T')[0],
      excerpt: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    };
    
    // This is a mock implementation. The data won't persist across page reloads.
    // In a real app, this would be an API call.
    console.log('New note created:', newNote);
    notes.push(newNote);

    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Note Created!',
        description: `"${title}" has been added to ${subject}.`,
      });
      router.push(`/subjects/${folders.find(f => f.name === subject)?.id || ''}`);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <CardTitle className="text-3xl font-bold">Create a New Note</CardTitle>
                    <CardDescription>Fill in the details below and save your new note.</CardDescription>
                </div>
           </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          <Select onValueChange={setSubject} value={subject}>
            <SelectTrigger className="text-lg">
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.name}>
                  <div className="flex items-center gap-2">
                    {folder.icon}
                    <span>{folder.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Start writing your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-[400px] resize-none font-headline text-lg leading-relaxed"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
