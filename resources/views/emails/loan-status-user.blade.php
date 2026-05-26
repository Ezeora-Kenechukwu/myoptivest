@component('mail::message')
# Loan {{ ucfirst(str_replace('_', ' ', $status)) }} Update

Dear {{ $loan->user->name }},

We have an update regarding your loan request (ID: {{ $loan->id }}):

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

@if($status == 'fully_repaid')
Your loan has been fully repaid. Thank you for using Optivest!
@endif

Please log in to your Optivest account to view more details or take further actions.

@component('mail::button', ['url' => route('loans.index')])
View Loan Details
@endcomponent

Thanks,<br>
Optivest Team
@endcomponent
