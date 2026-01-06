import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Vote,
  Archive,
  LogOut,
  Settings,
  UserCircle,
  HelpCircle,
  CheckCircle2,
  Search
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/candidates', icon: Users, label: 'Candidates' },
  { href: '/admin/voters', icon: UserCircle, label: 'Voters' },
  { href: '/admin/elections', icon: Archive, label: 'Elections' },
  { href: '#', icon: Settings, label: 'Settings' }
];

function SystemStatusCard() {
    return (
        <Card className="bg-primary/5 border-primary/20 mt-4">
            <CardHeader className="p-4">
                 <CardTitle className="flex items-center gap-2 text-sm">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span>System Status</span>
                 </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>All systems operational.</span>
                </div>
                 <Button size="sm" className="w-full mt-4">Check Status</Button>
            </CardContent>
        </Card>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Vote className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold font-headline">Xhunav</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SystemStatusCard />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-background">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="sm:hidden"/>
            <h1 className="text-2xl font-bold font-headline">Election Monitoring</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] rounded-full bg-white"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="overflow-auto p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
