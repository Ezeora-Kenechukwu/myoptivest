import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ saving }) {
  return <RecordDetailsPage title="Admin Savings Details" record={saving} backHref="/admin/savings" />;
}
