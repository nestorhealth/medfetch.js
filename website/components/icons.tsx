import React from 'react';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Simple wrapper that just passes through props
export const Icons = {
  ArrowLeft: (props: LucideProps) => <LucideIcons.ArrowLeft {...props} />,
  Database: (props: LucideProps) => <LucideIcons.Database {...props} />,
  Users: (props: LucideProps) => <LucideIcons.Users {...props} />,
  Activity: (props: LucideProps) => <LucideIcons.Activity {...props} />,
  AlertCircle: (props: LucideProps) => <LucideIcons.AlertCircle {...props} />,
  RefreshCw: (props: LucideProps) => <LucideIcons.RefreshCw {...props} />,
  Settings: (props: LucideProps) => <LucideIcons.Settings {...props} />,
}; 