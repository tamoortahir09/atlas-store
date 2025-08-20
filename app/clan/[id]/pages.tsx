import { redirect } from 'next/navigation';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For CSR, we'll generate some example clan IDs for static export
  return [
    { id: 'example-clan-1' },
    { id: 'example-clan-2' },
    { id: 'example-clan-3' },
  ];
}

export default async function ClanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Redirect to the manage page since that's the main functionality
  redirect(`/clan/${id}/manage`);
} 