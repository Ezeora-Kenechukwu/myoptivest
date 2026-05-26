import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ plan, savings_plan }) {
  return <RecordDetailsPage title="Savings Plan Details" record={plan || savings_plan} backHref="/savings-plans" />;
}
