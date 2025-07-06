// resources/js/Pages/Invitations/Accept.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Invitation, type PageProps, type BreadcrumbItem } from '@/types';
import { useEffect } from 'react';

interface InvitationAcceptProps extends PageProps {
    invitation: Invitation | null;
    status: 'pending' | 'invalid' | 'logged_in_match' | 'logged_in_mismatch';
}

export default function InvitationAccept({ invitation, status }: InvitationAcceptProps) {
    const { flash, auth } = usePage<InvitationAcceptProps>().props;
    const { post, processing } = useForm({}); // No form data needed for acceptance, just a POST request

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Invitation', active: true },
    ];

    const handleAccept = () => {
        if (invitation) {
            post(route('invitations.processAcceptance', invitation.token));
        }
    };

    useEffect(() => {
        // If there's a flash message, display it. This is a basic example.
        // In a real app, you might have a dedicated component for flash messages.
        if (flash.success) {
            console.log('Success:', flash.success);
        }
        if (flash.error) {
            console.log('Error:', flash.error);
        }
        if (flash.info) {
            console.log('Info:', flash.info);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accept Invitation" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto items-center justify-center">
                <Card className="max-w-lg w-full text-center">
                    <CardHeader>
                        <CardTitle>Organization Invitation</CardTitle>
                        <CardDescription>
                            {status === 'invalid' && (
                                <p className="text-red-500">This invitation link is invalid, expired, or has already been accepted.</p>
                            )}
                            {status === 'pending' && invitation && (
                                <p>You have been invited to join <strong>{invitation.organization.name}</strong>.</p>
                            )}
                            {status === 'logged_in_match' && invitation && (
                                <p>You are logged in as <strong>{auth.user.email}</strong>. This invitation is for <strong>{invitation.email}</strong>.
                                   Would you like to accept this invitation for <strong>{invitation.organization.name}</strong>?</p>
                            )}
                            {status === 'logged_in_mismatch' && invitation && (
                                <p className="text-yellow-500">
                                    You are currently logged in as <strong>{auth.user.email}</strong>. This invitation is for <strong>{invitation.email}</strong>.
                                    To accept this invitation, please log out and log in with the correct account, or register a new account using <strong>{invitation.email}</strong>.
                                </p>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status === 'pending' && invitation && (
                            <div className="space-y-4">
                                <p>To accept, please log in or register:</p>
                                <Link href={route('login')} className="block">
                                    <Button className="w-full">Log In</Button>
                                </Link>
                                <Link href={route('register')} className="block">
                                    <Button variant="outline" className="w-full">Register</Button>
                                </Link>
                                <p className="text-sm text-gray-500 mt-2">
                                    (If you register with {invitation.email}, you will automatically join {invitation.organization.name}.)
                                </p>
                            </div>
                        )}

                        {status === 'logged_in_match' && invitation && (
                            <div className="space-y-4">
                                <Button onClick={handleAccept} disabled={processing} className="w-full">
                                    {processing ? 'Accepting...' : 'Accept Invitation'}
                                </Button>
                                <Link href={route('dashboard')} className="block">
                                    <Button variant="outline" className="w-full">Go to Dashboard</Button>
                                </Link>
                            </div>
                        )}

                        {status === 'logged_in_mismatch' && (
                            <div className="space-y-4">
                                <Link href={route('logout')} method="post" as="button" className="block w-full">
                                    <Button variant="destructive" className="w-full">Log Out</Button>
                                </Link>
                                <Link href={route('dashboard')} className="block">
                                    <Button variant="outline" className="w-full">Go to Dashboard</Button>
                                </Link>
                            </div>
                        )}

                        {status === 'invalid' && (
                            <div className="space-y-4">
                                <Link href={route('dashboard')} className="block">
                                    <Button className="w-full">Go to Dashboard</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
