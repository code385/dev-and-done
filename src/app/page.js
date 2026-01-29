// This page should never render because middleware redirects `/` to `/en`
// But if it does, redirect to default locale
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/en');
}
