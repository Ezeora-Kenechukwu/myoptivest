@component('mail::message')
# Wallet Funded

Hello {{ $user->name }},

Your wallet has been successfully funded with ₦{{ number_format($amount, 2) }}.

**Reference:** {{ $reference }}

Thank you for using our service.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
