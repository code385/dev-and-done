import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
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

