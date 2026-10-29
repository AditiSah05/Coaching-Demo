import { notFound } from 'next/navigation';

// Any address that is not a real page must answer 404, not 200 (a "soft 404" hurts search ranking).
export default function Page() {
  notFound();
}
