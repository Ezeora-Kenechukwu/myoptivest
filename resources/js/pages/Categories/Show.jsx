import RecordDetailsPage from '@/components/RecordDetailsPage';

export default function Show({ category, investmentplancategory }) {
  return <RecordDetailsPage title="Category Details" record={category || investmentplancategory} backHref="/investment-plan-categories" />;
}
