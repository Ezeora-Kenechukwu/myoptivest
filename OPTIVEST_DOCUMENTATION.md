# OptiVest System Documentation

OptiVest is a Laravel + Inertia React financial platform for wallet funding, investments, savings, loans, referrals, notifications, staff/admin management and transaction reconciliation.

## Main roles

- **User**: registers, completes KYC, funds wallet, starts investments, uses daily savings, requests loans, views transactions and notifications.
- **Staff/Admin**: manages users, roles, permissions, plans, payments, transactions, savings, investments and loan approvals.

## Core user flow

1. Register and verify email.
2. Complete profile/KYC requirements.
3. Fund the OptiVest wallet through secure hosted payment or bank-transfer confirmation.
4. Subscribe to investment or savings plans using wallet balance.
5. Track dashboard balances, status cards, transactions and notifications.
6. Eligible users can request loans and repay them from approved balances.

## Admin flow

1. Sign in as an authorized admin/staff member.
2. Manage roles and permissions with least-privilege access.
3. Configure investment plans, savings plans, manual payment methods and loan plans.
4. Review transactions and payment confirmations.
5. Approve/reject investments and loans based on business rules.
6. Use the in-app admin documentation page at `/documentation/admin` for daily operating guidance.

## Payment and wallet architecture

Wallet movement is centralized through:

- `App\Services\WalletService`
- `App\Services\WalletFundingService`
- `wallet_ledgers` migration/model

Every credit/debit should use an idempotency key. Provider payment confirmation uses the Monnify reference as the idempotency key so webhook, callback and manual confirmation cannot double-credit the same payment.

Direct card PAN/CVV/PIN collection has been disabled at route level for PCI safety. Use hosted checkout/tokenized provider flows instead.

## Security model

- Protected routes require auth, verification and KYC where appropriate.
- Permission middleware now enforces permission + ability checks.
- User/admin/staff management routes are behind auth/verified/KYC.
- Monnify user-initiated routes are authenticated; only webhook remains public.
- Webhook signatures are validated with `hash_equals` before returning success.
- Public test email and public bank-sync routes were removed/protected.

## UI/design system

The UI now includes OptiVest design tokens based on the supplied Figma direction:

- Primary purple: `#5042DA`
- Soft surface: `#F5F5F5`
- Border: `#E9EAEB`
- Success: `#17B26A`
- Danger: `#F04438`

Responsive behavior should follow:

- Desktop: purple sidebar + dashboard grid/table layout.
- Tablet: 2-column cards.
- Mobile: drawer/sidebar navigation, stacked cards, card-style tables, full-width actions and bottom-sheet style modals.

## In-app documentation pages

- `/documentation/admin` - admin/staff operating guide.
- `/documentation/user` - user tutorial and safety guide.

These pages are linked from the sidebar where permissions allow.

## Deployment checklist

1. Copy `.env.example` to `.env` and configure database, mail, queue and Monnify credentials.
2. Run `php artisan key:generate` if this is a fresh environment.
3. Run `php artisan migrate --force`.
4. Run `npm install` and `npm run build`.
5. Configure queue worker and scheduler.
6. Confirm Monnify webhook URL points to `/monnify/webhook`.
7. Never deploy SQL dumps or development secrets.

## Validation performed in this package

- PHP syntax lint on `app`, `routes`, and `database`: passed.
- Laravel route discovery: passed.
- TypeScript check: passed.
- Vite production build: passed.
- Laravel/PHPUnit tests: blocked in this container because PHP DOM extension is missing.
