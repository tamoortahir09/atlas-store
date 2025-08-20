import PlayerProfilePage from '@/components/clan-portal/PlayerProfilePage';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For CSR, we'll generate some example profile IDs for static export
  // In a real scenario, you might want to pre-generate some common profile IDs
  return [
    { id: 'example-player-1' },
    { id: 'example-player-2' },
    { id: 'example-player-3' },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlayerProfilePage playerId={id} />;
} 