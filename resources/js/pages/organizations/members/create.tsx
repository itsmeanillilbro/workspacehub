// resources/js/Pages/Organizations/Members/Create.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react'; // Added usePage
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type Organization, type BreadcrumbItem, type PageProps } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from 'react'; // Added useEffect

interface OrganizationMemberCreateProps extends PageProps {
    organization: { data: Organization };
}

export default function CreateOrganizationMember({ organization }: OrganizationMemberCreateProps) {
    const orgData = organization.data;
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
        role: 'member',
    });

    const { flash } = usePage().props as PageProps; // Get flash messages

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        { title: orgData.name, href: route('organizations.show', orgData.id) },
        { title: 'Members', href: route('organizations.members.index', orgData.id) },
        { title: 'Invite', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('organizations.members.store', orgData.id));
    };

    // Optional: Clear form on successful submission
    useEffect(() => {
        if (recentlySuccessful) {
            setData({ email: '', role: 'member' });
        }
    }, [recentlySuccessful, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invite Member to ${orgData.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Invite Member to {orgData.name}</h2>
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{flash.error}</span>
                    </div>
                )}
                {flash.info && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{flash.info}</span>
                    </div>
                )}
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Invite New Member</CardTitle>
                        <CardDescription>Enter the email address of the user you want to invite.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    Send Invitation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
