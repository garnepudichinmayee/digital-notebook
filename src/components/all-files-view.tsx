
'use client';

import Link from 'next/link';
import type { Note, Document } from '@/lib/data.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getIconForType } from '@/lib/data';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type AllFilesViewProps = {
  items: (Note | Document)[];
};

export function AllFilesView({ items }: AllFilesViewProps) {
  const router = useRouter();
    // Sort items by last modified date
    const sortedItems = useMemo(() => [...items].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()), [items]);

  const handleRowClick = (item: Note | Document) => {
    const path = item.type === 'Note' ? '/notes/' : '/documents/';
    router.push(`${path}${item.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Files</CardTitle>
        <CardDescription>
          Browse and manage all your notes and documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead>Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {getIconForType(item.type)}
                        <span>{item.title}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={item.type === 'Note' ? 'secondary' : 'outline'}>{item.type}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.subject}</TableCell>
                <TableCell>{item.lastModified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
