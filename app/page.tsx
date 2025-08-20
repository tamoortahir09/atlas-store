'use client';

import { Suspense } from 'react';
import AppContent from './AppContent';

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AppContent />
    </Suspense>
  );
}