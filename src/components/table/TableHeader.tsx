import { PropsWithChildren } from 'react';

export function TableHeader({ children }: PropsWithChildren) {
  return (
    <div className="p-6 border-b border-outline-variant/10 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
      {children}
    </div>
  );
}

export default TableHeader;
