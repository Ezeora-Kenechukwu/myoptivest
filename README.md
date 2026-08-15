# OptiVest

OptiVest is a Laravel + Inertia React financial platform covering wallet funding, investments, savings, loans, referrals, notifications, staff/admin operations, and transaction reconciliation.

This public repository is presented as an engineering case study. It highlights application architecture, financial workflow design, access control, payment safety, and frontend/backend integration without making claims about production usage or commercial outcomes.

## Engineering focus

- Wallet funding and ledger-backed credit/debit workflows
- Investment and savings plan subscriptions
- Loan request, approval, and repayment workflows
- KYC-gated user journeys
- Role- and permission-based staff/admin operations
- Transaction reconciliation and payment confirmation
- Notifications and dashboard reporting
- Responsive React interfaces delivered through Inertia

## Stack

**Backend**
- PHP 8.2+
- Laravel 12
- Inertia Laravel 2
- Laravel Reverb
- Laravel Telescope
- Pest

**Frontend**
- React 19
- TypeScript 5.7
- Inertia React 2
- Tailwind CSS 4
- Redux Toolkit
- SWR
- Chart.js
- Radix UI / Headless UI
- Framer Motion
- Vite 6

## Architecture and financial safety

Wallet movement is centralized through dedicated wallet services and a ledger model. Credit and debit operations use idempotency keys so repeated payment callbacks or confirmations do not apply the same wallet movement more than once.

Monnify payment references are used as idempotency keys for provider confirmation flows. Direct collection of card PAN, CVV, or PIN data is disabled; payment flows are designed around hosted or tokenized provider experiences instead.

## Security model

The application includes:

- authenticated and verified routes
- KYC checks where required by workflow
- permission and ability checks for staff/admin actions
- protected user, staff, and administrative management routes
- authenticated user-initiated payment routes
- public webhook handling with signature validation
- removal/protection of development-only public routes

## Main user journey

1. Register and verify email.
2. Complete profile and KYC requirements.
3. Fund the wallet through supported payment flows.
4. Subscribe to investment or savings plans using available wallet balance.
5. Track balances, transactions, statuses, and notifications.
6. Eligible users can request loans and manage approved repayments.

## Admin and staff workflows

Authorized staff can manage roles, permissions, users, plans, payments, transactions, savings, investments, and loan approvals according to assigned access.

## Validation recorded in this repository

The documented validation pass includes:

- PHP syntax lint across `app`, `routes`, and `database` - passed
- Laravel route discovery - passed
- TypeScript type check - passed
- Vite production build - passed
- Laravel/PHPUnit test execution - blocked in the validation container because the PHP DOM extension was unavailable

## Additional documentation

- [`OPTIVEST_DOCUMENTATION.md`](./OPTIVEST_DOCUMENTATION.md) - architecture, workflows, security model, deployment checklist, and validation notes
- [`SECURITY_AND_FIXES_SUMMARY.md`](./SECURITY_AND_FIXES_SUMMARY.md) - security-focused implementation summary
- [`BUILD_VALIDATION.md`](./BUILD_VALIDATION.md) - build and validation notes

## About the engineer

I am **Ezeora Kenechukwu Johnbosco**, a Lead Software Engineer & Technical Instructor working across full-stack web and mobile product engineering with React, TypeScript, Laravel, Inertia, and React Native.

- Portfolio: https://ezeora-kenechukwu-portfolio.vercel.app/
- LinkedIn: https://www.linkedin.com/in/kenechukwu-ezeora-629a50365
- GitHub: https://github.com/Ezeora-Kenechukwu

## Repository note

This repository is intended to provide public technical evidence of the architecture and implementation approach. It should not be interpreted as evidence of user counts, revenue, production adoption, or other business outcomes unless separately verified.
