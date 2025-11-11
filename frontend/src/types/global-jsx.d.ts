// src/types/global-jsx.d.ts
declare module '*.jsx' {
  import * as React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
