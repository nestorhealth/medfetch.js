declare module 'lucide-react/dist/esm/icons' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export type Icon = FC<IconProps>;
  
  export const ArrowLeft: Icon;
  export const Database: Icon;
  export const Users: Icon;
  export const Activity: Icon;
  export const AlertCircle: Icon;
  export const RefreshCw: Icon;
  export const Settings: Icon;
} 