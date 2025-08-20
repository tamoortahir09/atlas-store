import React from 'react';
import MapVotingClient from './MapVotingClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate static params for known server IDs
  return [
    { serverId: 'eu-monthly' },
    { serverId: 'eu-weekly' },
  ];
}

interface PageProps {
  params: Promise<{ serverId: string }>;
}

export default async function MapVotingPage({ params }: PageProps) {
  const { serverId } = await params;
  return <MapVotingClient serverId={serverId} />;
} 