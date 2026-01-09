'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isLoginPage = pathname === '/client/login';

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check authentication for other pages
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/client/auth/me');
        const data = await response.json();
        
        if (data.success) {
          setClient(data.client);
        } else {
          router.push('/client/login');
        }
      } catch (error) {
        router.push('/client/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show authenticated layout
  return (
    <div className="min-h-screen bg-background">
      {/* Client Portal Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/client/dashboard" className="text-xl font-bold text-foreground">
                Client Portal
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/client/dashboard"
                  className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/client/files"
                  className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Files
                </Link>
              </nav>
            </div>
            {client && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.companyName || client.email}</p>
                </div>
                <form action="/api/client/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

