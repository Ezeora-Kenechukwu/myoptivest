# OptiVest Patch Summary

## Backend fixes

- Re-enabled permission middleware enforcement.
- Wrapped admin, staff and user management routes in auth/verified/KYC.
- Authenticated Monnify user actions and left only webhook public.
- Hardened Monnify webhook signature verification using `hash_equals`.
- Introduced wallet ledger and idempotent wallet funding services.
- Disabled direct card PAN/CVV/PIN collection routes for PCI safety.
- Fixed loan request closure bug involving `$user`.
- Added loan ownership checks for cancel/pay actions.
- Made loan disbursement idempotent and wallet-ledger based.
- Fixed loan disbursement wallet field bug (`wallet_balance` -> ledger/`wallet`).
- Fixed savings cancellation refund to only refund the cancelled saving contributions.
- Protected bank sync route and removed public test email route.
- Removed SQL dumps from the packaged codebase and added ignore rules.

## Frontend fixes

- Fixed case-sensitive imports that broke Linux/Vite builds.
- Fixed missing Outlook asset filename mismatch.
- Replaced React Router imports with Inertia Link imports.
- Added OptiVest Figma-aligned design tokens and responsive utility classes.
- Added admin/user documentation and tutorial pages.
- Added sidebar documentation entries.
- Fixed TypeScript errors by correcting component props, unsafe indexes and legacy module references.
- Fixed duplicate object keys that produced build warnings.

## Remaining recommendations

- Add full policy classes for every money-owning resource.
- Add automated feature tests for permissions, payment idempotency, owner checks and ledger balances.
- Remove/replace leftover Celebrity/Reservation modules if they are not part of OptiVest.
- Lazy-load heavy rich-text editor chunks.
- Sanitize all admin-provided HTML before rendering it.
