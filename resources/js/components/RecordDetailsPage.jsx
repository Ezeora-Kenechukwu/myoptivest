import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? '' : 's'}`;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

export default function RecordDetailsPage({ title, record, backHref = '/dashboard' }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title, href: backHref },
  ];

  const entries = Object.entries(record || {}).filter(([key]) => !['deleted_at'].includes(key));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />
      <main className="opti-mobile-shell py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-[#0A0D12]">{title}</h1>
          <Link href={backHref} className="inline-flex rounded-full border border-[#5042DA] px-4 py-2 text-sm font-semibold text-[#5042DA]">
            Back
          </Link>
        </div>

        <section className="opti-card overflow-hidden">
          <dl className="grid divide-y divide-[#E9EAEB]">
            {entries.map(([key, value]) => (
              <div key={key} className="grid gap-2 p-4 sm:grid-cols-[220px_1fr]">
                <dt className="text-sm font-medium capitalize text-[#717680]">{key.replaceAll('_', ' ')}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-[#0A0D12]">{formatValue(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </AppLayout>
  );
}
