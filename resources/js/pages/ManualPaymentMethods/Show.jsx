import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ method }) {
  return <RecordDetailsPage title="Manual Payment Method Details" record={method} backHref="/manual-payment-methods" />;
}
