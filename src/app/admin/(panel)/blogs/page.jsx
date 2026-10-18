import { CollectionManager } from '../../../../components/admin/CollectionManager';

export default function Page() {
  return <CollectionManager name="blogs" title="Blog" subtitle="Write and publish articles. A draft is saved but not shown to visitors." createLabel="Write a post" previewHref="/blogs/" />;
}
