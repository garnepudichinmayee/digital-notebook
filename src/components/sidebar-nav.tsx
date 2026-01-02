'use client';
import {
  Bell,
  Book,
  Home,
  Package2,
  Settings,
  Users,
  Folder as FolderIcon,
  File,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';
import type { Folder } from '@/lib/data.tsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';

type SidebarNavProps = {
  folders: Folder[];
};

export function SidebarNav({ folders }: SidebarNavProps) {
  return (
    <>
    <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Icons.logo className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">ScholarSlate</span>
        </div>
    </SidebarHeader>

    <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                    <Link href="/">
                        <Home />
                        <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="#">
                    <Bell />
                    <span>Notifications</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
            <SidebarGroupLabel>Subjects</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {folders.map((folder) => (
                        <SidebarMenuItem key={folder.id}>
                            <SidebarMenuButton href="#">
                                {folder.icon}
                                <span>{folder.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

    </SidebarContent>

    <SidebarFooter>
        <div className="p-4 space-y-2">
            <div className="flex items-center text-xs justify-between text-sidebar-foreground/70">
                <p>Storage</p>
                <p>2.1 / 15 GB</p>
            </div>
            <Progress value={14} className="h-2" />
             <Button variant="outline" className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80">
                Upgrade Storage
            </Button>
        </div>
    </SidebarFooter>
    </>
  );
}
