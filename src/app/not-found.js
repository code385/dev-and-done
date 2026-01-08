import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function NotFound() {
  const suggestions = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blogs', label: 'Blog' },
    { href: '/books', label: 'Books' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1 text-sm bg-muted hover:bg-primary hover:text-white rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              Go Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

