import { CollectionManager } from '../../../../components/admin/CollectionManager';

export default function Page() {
  return <CollectionManager name="enquiries" title="Enquiries" subtitle="Messages sent from the Contact page, and ones you add yourself, for example after a phone call." statusKey="status" exportCsv createLabel="Add enquiry" />;
}
