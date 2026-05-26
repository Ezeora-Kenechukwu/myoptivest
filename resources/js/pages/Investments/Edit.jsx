import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Edit({ investment }) {
  return <RecordDetailsPage title="Edit Investment" record={investment} backHref="/investments" />;
}
