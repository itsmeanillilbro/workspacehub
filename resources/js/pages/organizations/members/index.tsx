// resources/js/pages/Organizations/Members/Index.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type OrganizationMembersIndexProps, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

export default function OrganizationMembersIndex({ organization, members }: OrganizationMembersIndexProps) {
    const { auth } = usePage<OrganizationMembersIndexProps>().props;

    const orgData = organization?.data || null;

    // Access the actual array of members from members.data
    const membersList = members.data;

    const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = React.useState(false);
    const [memberToRemove, setMemberToRemove] = React.useState<User | null>(null);

    const breadcrumbs: BreadcrumbItem[] = orgData
        ? [
              { title: 'Dashboard', href: route('dashboard') },
              { title: 'Organizations', href: route('organizations.index') },
              { title: orgData.name, href: orgData.id ? route('organizations.show', orgData.id) : '#' },
              { title: 'Members', active: true },
          ]
        : [
              { title: 'Dashboard', href: route('dashboard') },
              { title: 'Organizations', href: route('organizations.index') },
              { title: 'Members', active: true },
          ];

    const openRemoveMemberDialog = (member: User) => {
        setMemberToRemove(member);
        setIsRemoveMemberDialogOpen(true);
    };

    const confirmRemoveMember = () => {
        if (memberToRemove && orgData?.id) {
            router.delete(route('organizations.members.destroy', { organization: orgData.id, member: memberToRemove.id }), {
                onSuccess: () => {
                    setIsRemoveMemberDialogOpen(false);
                    setMemberToRemove(null);
                },
                onError: (errors) => {
                    console.error('Error removing member:', errors);
                    setIsRemoveMemberDialogOpen(false);
                    setMemberToRemove(null);
                },
            });
        } else {
            console.error('Cannot remove member: Organization data or member data is missing.');
        }
    };

    const handleRoleChange = (member: User, newRole: string) => {
        if (orgData?.id) {
            router.put(
                route('organizations.members.update', {
                    organization: orgData.id,
                    member: member.id,
                }),
                { role: newRole },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.reload({ only: ['members'] });
                    },
                    onError: (errors) => {
                        console.error('Error updating role:', errors);
                        // Show specific error if available
                        const errorMsg = errors.message || 'Failed to update role';
                    },
                },
            );
        }
    };

    if (!orgData || !orgData.id) {
        console.error('OrganizationMembersIndex: Missing or invalid organization data.', organization);
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Organization Members - Error" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl p-4">
                    <h2 className="text-xl leading-tight font-semibold text-red-600 dark:text-red-400">Error Loading Organization Members</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        The organization data required to display members could not be loaded. This might be due to an invalid organization ID or a
                        backend issue.
                    </p>
                    <Link href={route('organizations.index')}>
                        <Button className="rounded-md">Go to Organizations List</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${orgData.name} Members`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">{orgData.name} Members</h2>

                <Card className="rounded-lg shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                        <CardTitle className="text-lg font-semibold">Organization Members</CardTitle>
                        <Link href={route('organizations.members.create', orgData.id)}>
                            <Button size="sm" className="rounded-md">
                                <Plus className="mr-2 h-4 w-4" /> Invite Member
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        {Array.isArray(membersList) && membersList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {membersList.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">{member.email}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        // Ensure the value is directly from the membersList
                                                        value={member.pivot?.role || 'member'} // Fallback to member if pivot is null
                                                        onValueChange={(value) => handleRoleChange(member, value)}
                                                        disabled={auth.user.id === member.id || member.pivot?.role === 'owner'}
                                                    >
                                                        <SelectTrigger className="w-[120px] rounded-md">
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="member">Member</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {auth.user.id !== member.id && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="rounded-md"
                                                            onClick={() => openRemoveMemberDialog(member)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-gray-600 dark:text-gray-400">
                                No members in this organization yet.{' '}
                                <Link
                                    href={orgData.id ? route('organizations.members.create', orgData.id) : '#'}
                                    className="text-blue-600 hover:underline"
                                >
                                    Invite someone!
                                </Link>
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
                <DialogContent className="rounded-lg sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Remove Member?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {memberToRemove?.name || 'this member'} from this organization?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsRemoveMemberDialogOpen(false)} className="rounded-md">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmRemoveMember} className="rounded-md">
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
