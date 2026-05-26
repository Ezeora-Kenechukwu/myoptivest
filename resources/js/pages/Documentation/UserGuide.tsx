import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeHelp, Banknote, Landmark, LineChart, PiggyBank, Wallet } from 'lucide-react';

const breadcrumbs = [{ title: 'User Tutorial', href: '/documentation/user' }];

const steps = [
  { icon: Wallet, title: 'Create and verify your account', text: 'Register, complete your profile, verify your email and finish any KYC steps before using money features.' },
  { icon: Banknote, title: 'Fund your wallet', text: 'Use the Fund button to start a secure hosted checkout or bank-transfer funding flow. Your wallet updates after provider confirmation.' },
  { icon: LineChart, title: 'Start an investment', text: 'Review available investment plans, compare expected returns and timelines, then subscribe with wallet balance.' },
  { icon: PiggyBank, title: 'Use daily savings', text: 'Pick a savings plan, set your target and monitor contribution progress from the savings page.' },
  { icon: Landmark, title: 'Request a loan', text: 'Eligible users can request loans based on platform rules. Admins review and approve eligible requests.' },
  { icon: BadgeHelp, title: 'Track activity', text: 'Use transactions, notifications and dashboard cards to monitor funding, savings, investments, withdrawals and repayments.' },
];

export default function UserGuide() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Tutorial" />
      <main className="opti-mobile-shell py-6 sm:py-8">
        <section className="rounded-[28px] bg-[#5042DA] p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-medium text-white/75">OptiVest User Tutorial</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">How to use OptiVest</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-base">This quick guide explains how users fund wallets, invest, save, request loans, monitor activities and stay safe on the platform.</p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="opti-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-2xl bg-[#EEF2FF] p-3 text-[#5042DA]"><step.icon className="h-6 w-6" /></span>
                <span className="text-sm font-semibold text-[#A4A7AE]">Step {index + 1}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-[#0A0D12]">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#717680]">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 opti-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-[#0A0D12]">Safety tips</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Never share your password or transaction PIN.', 'Confirm you are on the official OptiVest domain before logging in.', 'Contact support if a wallet transaction looks wrong.'].map((tip) => (
              <div key={tip} className="rounded-2xl border border-[#E9EAEB] p-4 text-sm leading-6 text-[#717680]">{tip}</div>
            ))}
          </div>
          <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5042DA] px-5 py-3 text-sm font-semibold text-white opti-focus-ring">Go to dashboard <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
    </AppLayout>
  );
}
