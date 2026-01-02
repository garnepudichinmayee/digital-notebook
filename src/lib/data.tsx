import React from 'react';
import {
  Folder as FolderIcon,
  FileText,
  BookOpen,
  FlaskConical,
  Atom,
  Feather,
  Sigma,
  Scale,
  Languages,
  PenSquare,
  Landmark,
} from 'lucide-react';

export type Folder = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export type Note = {
  id: string;
  title: string;
  type: 'Note';
  subject: string;
  lastModified: string;
  excerpt: string;
};

export type Document = {
  id: string;
  title: string;
  type: 'Document';
  subject: string;
  lastModified: string;
  excerpt: string;
};

export const folders: Folder[] = [
  { id: '1', name: 'Molecular Biology', icon: <Atom className="h-4 w-4" /> },
  { id: '2', name: 'Organic Chemistry', icon: <FlaskConical className="h-4 w-4" /> },
  { id: '3', name: 'European History', icon: <Landmark className="h-4 w-4" /> },
  { id: '4', name: 'Calculus II', icon: <Sigma className="h-4 w-4" /> },
  { id: '5', name: 'Creative Writing', icon: <PenSquare className="h-4 w-4" /> },
  { id: '6', name: 'Physics', icon: <Atom className="h-4 w-4" /> },
  { id: '7', name: 'Law', icon: <Scale className="h-4 w-4" /> },
  { id: '8', name: 'Languages', icon: <Languages className="h-4 w-4" /> },
];

export const notes: Note[] = [
  {
    id: 'n1',
    title: 'Lecture 1: DNA Replication',
    type: 'Note',
    subject: 'Molecular Biology',
    lastModified: '2024-07-20',
    excerpt: 'Key enzymes: Helicase, Polymerase, Ligase...',
  },
  {
    id: 'n2',
    title: 'SN1 vs SN2 Reactions',
    type: 'Note',
    subject: 'Organic Chemistry',
    lastModified: '2024-07-19',
    excerpt: 'Comparison of reaction mechanisms, stereochemistry...',
  },
  {
    id: 'n3',
    title: 'The French Revolution',
    type: 'Note',
    subject: 'European History',
    lastModified: '2024-07-21',
    excerpt: 'Causes, major events, and the rise of Napoleon...',
  },
    {
    id: 'n4',
    title: 'Integration by Parts',
    type: 'Note',
    subject: 'Calculus II',
    lastModified: '2024-07-18',
    excerpt: 'Formula: ∫u dv = uv - ∫v du. Examples and practice problems...',
  },
];

export const documents: Document[] = [
  {
    id: 'd1',
    title: 'Research Paper: CRISPR-Cas9',
    type: 'Document',
    subject: 'Molecular Biology',
    lastModified: '2024-07-15',
    excerpt: 'A review of gene-editing technologies and their applications.',
  },
  {
    id: 'd2',
    title: 'Syllabus - Spring 2024',
    type: 'Document',
    subject: 'Organic Chemistry',
    lastModified: '2024-01-10',
    excerpt: 'Course outline, grading policy, and schedule.',
  },
    {
    id: 'd3',
    title: 'Primary Source: Declaration of the Rights of Man',
    type: 'Document',
    subject: 'European History',
    lastModified: '2024-07-12',
    excerpt: 'Full text for analysis and class discussion.',
  },
];

export const getIconForType = (type: 'Note' | 'Document') => {
    switch (type) {
        case 'Note':
            return <FileText className="h-4 w-4 text-muted-foreground" />;
        case 'Document':
            return <BookOpen className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
}
