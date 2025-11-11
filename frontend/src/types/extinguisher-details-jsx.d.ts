declare module './components/ExtinguisherDetails.jsx' {
  import * as React from 'react';
  import type { Extinguisher } from '../types';

  export type Props = {
    open: boolean;
    onClose: () => void;
    data: Extinguisher | null;
    primaryColor?: string;
  };

  const Component: React.FC<Props>;
  export default Component;
}
