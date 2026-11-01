/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { ScanEngine } from './components/ScanEngine';
import { Dashboard } from './components/Dashboard';
import { IndustryData } from './data/mockData';

export default function App() {
  const [activeScan, setActiveScan] = useState<IndustryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-500/30 selection:text-zinc-200">
      <Header />
      <main className="flex-1">
        {!activeScan ? (
          <ScanEngine
            onScanComplete={(data) => setActiveScan(data)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <Dashboard data={activeScan} onBack={() => setActiveScan(null)} />
        )}
      </main>
    </div>
  );
}
