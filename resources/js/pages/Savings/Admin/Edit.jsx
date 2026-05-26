import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Edit({ saving }) {
  return <RecordDetailsPage title="Edit Admin Savings" record={saving} backHref="/admin/savings" />;
}
