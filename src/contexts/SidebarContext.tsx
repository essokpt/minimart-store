import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SidebarState = 'show' | 'mini' | 'hidden';

interface SidebarContextType {
  state: SidebarState;
  setState: (state: SidebarState) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarState>('show');

  const toggle = () => {
    setState((current) => {
      if (current === 'show') return 'mini';
      if (current === 'mini') return 'hidden';
      return 'show';
    });
  };

  return (
    <SidebarContext.Provider value={{ state, setState, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
