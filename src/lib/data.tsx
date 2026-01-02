import React from 'react';
import {
  FileText,
  BookOpen,
  FlaskConical,
  Atom,
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
  manualHighlights: string[];
};

export type Document = {
  id: string;
  title: string;
  type: 'Document';
  subject: string;
  lastModified: string;
  excerpt: string;
  manualHighlights: string[];
};

export const folders: Folder[] = [
  { id: 'molecular-biology', name: 'Molecular Biology', icon: <Atom className="h-4 w-4" /> },
  { id: 'organic-chemistry', name: 'Organic Chemistry', icon: <FlaskConical className="h-4 w-4" /> },
  { id: 'european-history', name: 'European History', icon: <Landmark className="h-4 w-4" /> },
  { id: 'calculus-ii', name: 'Calculus II', icon: <Sigma className="h-4 w-4" /> },
  { id: 'creative-writing', name: 'Creative Writing', icon: <PenSquare className="h-4 w-4" /> },
  { id: 'physics', name: 'Physics', icon: <Atom className="h-4 w-4" /> },
  { id: 'law', name: 'Law', icon: <Scale className="h-4 w-4" /> },
  { id: 'languages', name: 'Languages', icon: <Languages className="h-4 w-4" /> },
];

export const notes: Note[] = [
  {
    id: 'n1',
    title: 'Lecture 1: DNA Replication',
    type: 'Note',
    subject: 'Molecular Biology',
    lastModified: '2024-07-20',
    excerpt: 'Key enzymes: Helicase, Polymerase, Ligase...',
    manualHighlights: ['DNA replication is semi-conservative.'],
  },
  {
    id: 'n2',
    title: 'SN1 vs SN2 Reactions',
    type: 'Note',
    subject: 'Organic Chemistry',
    lastModified: '2024-07-19',
    excerpt: 'Comparison of reaction mechanisms, stereochemistry...',
    manualHighlights: [],
  },
  {
    id: 'n3',
    title: 'The French Revolution',
    type: 'Note',
    subject: 'European History',
    lastModified: '2024-07-21',
    excerpt: 'Causes, major events, and the rise of Napoleon...',
    manualHighlights: ['The storming of the Bastille was a pivotal moment.'],
  },
    {
    id: 'n4',
    title: 'Integration by Parts',
    type: 'Note',
    subject: 'Calculus II',
    lastModified: '2024-07-18',
    excerpt: 'Formula: ∫u dv = uv - ∫v du. Examples and practice problems...',
    manualHighlights: [],
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
    manualHighlights: [],
  },
  {
    id: 'd2',
    title: 'Syllabus - Spring 2024',
    type: 'Document',
    subject: 'Organic Chemistry',
    lastModified: '2024-01-10',
    excerpt: 'Course outline, grading policy, and schedule.',
    manualHighlights: ['Midterm is on March 15th.'],
  },
    {
    id: 'd3',
    title: 'Primary Source: Declaration of the Rights of Man',
    type: 'Document',
    subject: 'European History',
    lastModified: '2024-07-12',
    excerpt: 'Full text for analysis and class discussion.',
    manualHighlights: [],
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

// A mock in-memory store for full document content.
export const documentContentStore: { [key: string]: string } = {};
// A mock in-memory store for full note content.
export const noteContentStore: { [key: string]: string } = {};
