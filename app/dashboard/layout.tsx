import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas Clan Dashboard',
  description: 'Comprehensive clan management dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      {children}
    </div>
  );
}