import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ plan, investmentplan }) {
  return <RecordDetailsPage title="Investment Plan Details" record={plan || investmentplan} backHref="/investment-plans" />;
}
