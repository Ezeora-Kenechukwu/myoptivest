import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ investment }) {
  return <RecordDetailsPage title="Investment Details" record={investment} backHref="/investments" />;
}
