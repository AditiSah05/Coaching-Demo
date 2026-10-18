import { CollectionManager } from '../../../../components/admin/CollectionManager';

export default function Page() {
  return <CollectionManager name="admissions" title="Admissions" subtitle="Applications sent from the admission form. Move each one along as you contact and enrol the student." statusKey="status" exportCsv createLabel="Add application" />;
}
