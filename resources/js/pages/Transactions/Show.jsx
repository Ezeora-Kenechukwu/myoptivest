import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ transaction }) {
  return <RecordDetailsPage title="Transaction Details" record={transaction} backHref="/transactions" />;
}
