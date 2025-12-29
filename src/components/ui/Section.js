'use client';

export default function Section({
  children,
  id,
  className = '',
  container = true,
  ...props
}) {
  const containerStyles = container ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${containerStyles} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

