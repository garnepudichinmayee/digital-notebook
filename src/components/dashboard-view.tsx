import Link from 'next/link';
import { ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import type { Note, Document } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DashboardViewProps = {
  notes: Note[];
  documents: Document[];
};

export function DashboardView({ notes, documents }: DashboardViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Notes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.slice(0, 3).map((note) => (
              <div key={note.id} className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{note.title}</p>
                  <p className="text-sm text-muted-foreground font-headline">{note.excerpt}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/notes/${note.id}`}>Open</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{doc.title}</p>
                  <p className="text-sm text-muted-foreground font-headline">{doc.excerpt}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/documents/${doc.id}`}>Read</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
