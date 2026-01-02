import { notes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function NotePage({ params }: { params: { id: string } }) {
  const note = notes.find((n) => n.id === params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-3xl m-4">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">{note.title}</CardTitle>
                <CardDescription className="text-lg">Subject: {note.subject} | Last Modified: {note.lastModified}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="font-headline text-lg leading-relaxed">{note.excerpt}</p>
                <p className="font-headline text-lg leading-relaxed mt-4">
                    This is a placeholder for the full note content. You can expand on the excerpt here with more details, examples, and explanations related to "{note.title}".
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
