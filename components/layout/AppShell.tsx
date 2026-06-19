'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import SidebarNav from './SidebarNav';
import AppTopBar from './AppTopBar';

export const AppShellContext = createContext(false);
export const useInAppShell = () => useContext(AppShellContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarNav onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppTopBar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <AppShellContext.Provider value={true}>
            {children}
          </AppShellContext.Provider>
        </main>
      </div>
    </div>
  );
}
