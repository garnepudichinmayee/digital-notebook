import { documents } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const doc = documents.find((d) => d.id === params.id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-3xl m-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{doc.title}</CardTitle>
          <CardDescription className="text-lg">Subject: {doc.subject} | Last Modified: {doc.lastModified}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="font-headline text-lg leading-relaxed">{doc.excerpt}</p>
             <p className="font-headline text-lg leading-relaxed mt-4">
                This is a placeholder for the full document content. You can expand on the excerpt here with the complete text of "{doc.title}".
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
