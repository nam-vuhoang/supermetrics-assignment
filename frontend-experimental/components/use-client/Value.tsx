import { ReactNode } from 'react';

export function Value({ children }: { children: ReactNode }) {
  return (
    <strong>
      <i>{children}</i>
    </strong>
  );
}
