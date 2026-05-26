import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ permission }) {
  return <RecordDetailsPage title="Permission Details" record={permission} backHref="/permissions" />;
}
