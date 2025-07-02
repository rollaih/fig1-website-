import { ReactNode } from 'react';
import AuthWrapper from '@/components/AuthWrapper';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  );
}