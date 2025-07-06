<x-mail::message>
# Invitation to Join {{ $organizationName }}

You have been invited to join the organization **{{ $organizationName }}**.

To accept this invitation and join the organization, please click the button below:

<x-mail::button :url="$invitationLink">
Accept Invitation
</x-mail::button>

This invitation will expire on {{ $invitation->expires_at->format('M d, Y H:i A') }}.

If you did not expect this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
