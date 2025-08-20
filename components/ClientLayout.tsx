'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import ReduxProvider from './providers/ReduxProvider';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <CartProvider>
        <LayoutContent>{children}</LayoutContent>
        <Toaster />
      </CartProvider>
    </ReduxProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're in dashboard mode
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  // Check if we're in the clan portal (only hide navbar for clan portal)
  const isClanPortal = pathname === '/clans' || 
                      (pathname.startsWith('/clan/') && !isDashboard) ||
                      pathname === '/leaderboards';

  // If we're in dashboard mode, render without navbar (footer handled at root level)
  if (isDashboard) {
    return <>{children}</>;
  }

  // If we're in clan portal, render without navbar (footer handled at root level)
  if (isClanPortal) {
    return <>{children}</>;
  }

  // Main site with navbar (footer handled at root level)
  return (
    <>
      <Navbar />
      {children}
    </>
  );
} 