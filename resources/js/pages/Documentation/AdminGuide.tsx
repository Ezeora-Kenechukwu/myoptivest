import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, CheckCircle2, CreditCard, ShieldCheck, Users, WalletCards } from 'lucide-react';

const breadcrumbs = [{ title: 'Admin Documentation', href: '/documentation/admin' }];

const sections = [
  {
    icon: ShieldCheck,
    title: 'Security and access control',
    body: 'Admins manage users, roles and permissions. Every protected page should require authentication, verification, KYC where relevant, and the permission ability attached to the action.',
    tips: ['Use Roles to group permissions.', 'Suspend risky accounts instead of deleting records.', 'Audit permission changes before assigning them.'],
  },
  {
    icon: WalletCards,
    title: 'Wallet and payment flow',
    body: 'Users fund their OptiVest wallet through secure hosted payment and bank-transfer confirmation. Confirmed payments are posted through the wallet ledger to avoid duplicate credits.',
    tips: ['Do not manually credit users outside the ledger.', 'Use transaction references when reconciling Monnify.', 'Webhook and manual confirmation are idempotent.'],
  },
  {
    icon: CreditCard,
    title: 'Investments, savings and loans',
    body: 'Investment plans and savings plans define what users can subscribe to. Loans are requested by users and approved by admins only when the user meets the platform requirements.',
    tips: ['Keep plans inactive until reviewed.', 'Approve loans only after checking balances and repayment eligibility.', 'Use status filters for reconciliation.'],
  },
  {
    icon: Users,
    title: 'User management',
    body: 'Admin, staff and user manager screens allow controlled account operations including profile review, role assignment, suspension and verification management.',
    tips: ['Grant the least permission needed.', 'Do not share admin accounts.', 'Use verification status before enabling sensitive actions.'],
  },
];

export default function AdminGuide() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Documentation" />
      <main className="opti-mobile-shell py-6 sm:py-8">
        <section className="rounded-[28px] bg-gradient-to-br from-[#5042DA] to-[#5F2ED1] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/75">OptiVest Admin Tutorial</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">Operate the platform safely and confidently</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-base">This guide explains the full admin workflow: permissions, users, wallets, investments, savings, loans, payments, reconciliation, and daily operating checks.</p>
            </div>
            <BookOpen className="h-14 w-14 shrink-0 text-white/80" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="opti-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="rounded-2xl bg-[#EEF2FF] p-3 text-[#5042DA]"><section.icon className="h-6 w-6" /></span>
                <div>
                  <h2 className="text-lg font-semibold text-[#0A0D12]">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#717680]">{section.body}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-[#0A0D12]"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#17B26A]" /> {tip}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 opti-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0A0D12]">Recommended daily admin checklist</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Review pending transactions', 'Check webhook/payment exceptions', 'Review loan requests', 'Audit new admin/staff changes'].map((item) => (
              <div key={item} className="rounded-2xl bg-[#F5F5F5] p-4 text-sm font-medium text-[#0A0D12]">{item}</div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#717680]">Need the customer-facing flow? Open the <Link href="/documentation/user" className="font-semibold text-[#5042DA]">user tutorial</Link>.</p>
        </section>
      </main>
    </AppLayout>
  );
}
