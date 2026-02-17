import { Link, useLocation, Outlet } from '@tanstack/react-router';
import { useAdminLogout } from './hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Package,
  Image,
  Mail,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
  { path: '/admin/sections', label: 'Page Sections', icon: FileText },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/contact', label: 'Contact Info', icon: Mail },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

function AdminSidebar() {
  const location = useLocation();
  const { mutate: logout, isPending } = useAdminLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/30">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <BrandLogo className="h-8 w-8" />
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full" 
          size="sm"
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
