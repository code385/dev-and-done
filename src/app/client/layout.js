import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function ClientLayout({ children }) {
  // Delegate to client component wrapper to handle pathname-based conditional rendering
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
