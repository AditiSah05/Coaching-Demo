import { AdminLogin } from '../../../views/admin/AdminLogin';
import { gateValue } from '../../../lib/gate';

// Built on every request: the token only goes to whoever opens the secret entry address.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const entry = process.env.ADMIN_ENTRY;
  return <AdminLogin gate={entry ? await gateValue(entry) : ''} />;
}
