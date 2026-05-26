import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Edit({ saving }) {
  return <RecordDetailsPage title="Edit Savings" record={saving} backHref="/savings" />;
}
