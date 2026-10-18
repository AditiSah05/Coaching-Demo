import { CollectionManager } from '../../../../components/admin/CollectionManager';

export default function Page() {
  return <CollectionManager name="gallery" title="Photo gallery" subtitle="Photos on the Gallery page. Mark one as the lead photo to show it first." createLabel="Add photo" />;
}
