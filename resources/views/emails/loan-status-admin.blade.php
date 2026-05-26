@component('mail::message')
# Loan {{ ucfirst(str_replace('_', ' ', $status)) }} Notification

Dear Admin,

A loan action has occurred for Loan ID: {{ $loan->id }}.

**User**: {{ $loan->user->name }}
**Status**: {{ ucfirst(str_replace('_', ' ', $status)) }}
**Amount**: ₦{{ number_format($loan->amount, 2) }}
**Loan Plan**: {{ $loan->loanPlan->name }}
**Date**: {{ now()->format('Y-m-d H:i:s') }}

@if($status == 'rejected' && $reason)
**Reason for Rejection**: {{ $reason }}
@endif

@if($status == 'manual_payment' || $status == 'repaid')
**Payment Amount**: ₦{{ number_format($amount, 2) }}
@endif

Please review the loan details in the admin dashboard.

@component('mail::button', ['url' => route('admin.loans.index')])
View Loan Details
@endcomponent

Thanks,<br>
Optivest Team
@endcomponent
