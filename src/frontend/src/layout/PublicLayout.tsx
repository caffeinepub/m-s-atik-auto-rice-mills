import { Outlet } from '@tanstack/react-router';
import HeaderNav from '../components/HeaderNav';
import SiteFooter from '../components/SiteFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
