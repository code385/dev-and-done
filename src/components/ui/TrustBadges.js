'use client';

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
        <div className="text-sm text-muted-foreground">Uptime</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-1">SSL</div>
        <div className="text-sm text-muted-foreground">Secured</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-1">GDPR</div>
        <div className="text-sm text-muted-foreground">Compliant</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary mb-1">24/7</div>
        <div className="text-sm text-muted-foreground">Support</div>
      </div>
    </div>
  );
}

