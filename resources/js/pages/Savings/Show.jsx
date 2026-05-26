import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ saving }) {
  return <RecordDetailsPage title="Savings Details" record={saving} backHref="/savings" />;
}
