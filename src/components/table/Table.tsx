import { PropsWithChildren } from 'react';

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-x-auto">
      {children}
    </div>
  );
}

export default Table;
