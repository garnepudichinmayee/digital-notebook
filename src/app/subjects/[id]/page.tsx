'use client';

import { notFound } from 'next/navigation';
import { folders, notes, documents, type Note, type Document } from '@/lib/data';
import {
  File,
  Home,
  Menu,
  NotebookPen,
  Plus,
  Search,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { AllFilesView } from '@/components/all-files-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function SubjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const folder = folders.find((f) => f.id === id);

  if (!folder) {
    notFound();
  }

  const subjectItems = [...notes, ...documents].filter(item => item.subject === folder.name);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav folders={folders} />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <SidebarNav folders={folders} />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold md:text-2xl">{folder.name}</h1>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>CS</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
             <div className="flex items-center">
                <h2 className="text-lg font-semibold">Files in {folder.name}</h2>
                <div className="ml-auto flex items-center gap-2">
                  <Button asChild>
                    <Link href="/notes/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Note
                    </Link>
                  </Button>
                </div>
              </div>
            <AllFilesView items={subjectItems} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
