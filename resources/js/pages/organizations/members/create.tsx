// resources/js/pages/Organizations/Members/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type Organization, type PageProps, type User, type BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react'; // Import React for useState

// Update the interface to account for the 'data' wrapper on 'organization'
interface OrganizationMembersIndexProps extends PageProps {
    organization: {
        data: Organization; // Expect the organization object to be nested under 'data'
    };
    members: (User & { pivot: { role: string } })[]; // Keep members as an array
}

export default function OrganizationMembersIndex({ organization, members }: OrganizationMembersIndexProps) {
    const { auth } = usePage<OrganizationMembersIndexProps>().props;

    // Destructure the actual organization data from the 'data' property
    const orgData = organization.data;

    // State for the remove member confirmation dialog
    const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = React.useState(false);
    const [memberToRemove, setMemberToRemove] = React.useState<User | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        // Use orgData.name and orgData.id for routes
        { title: orgData.name, href: route('organizations.show', orgData.id) },
        { title: 'Members', active: true },
    ];

    // Function to open the remove member dialog
    const openRemoveMemberDialog = (member: User) => {
        setMemberToRemove(member);
        setIsRemoveMemberDialogOpen(true);
    };

    // Function to handle the actual member removal after confirmation
    const confirmRemoveMember = () => {
        if (memberToRemove) {
            router.delete(route('organizations.members.destroy', { organization: orgData.id, member: memberToRemove.id }), {
                onSuccess: () => {
                    setIsRemoveMemberDialogOpen(false); // Close dialog on success
                    setMemberToRemove(null); // Clear the member to remove
                },
                onError: (errors) => {
                    console.error('Error removing member:', errors);
                    setIsRemoveMemberDialogOpen(false); // Close dialog even on error
                    setMemberToRemove(null);
                    // Optionally display a toast or flash message here
                },
            });
        }
    };

    const handleRoleChange = (member: User, newRole: string) => {
        router.put(route('organizations.members.update', { organization: orgData.id, member: member.id }), {
            role: newRole,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally show a success message via toast if needed, but AppLayout handles general flashes
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Use orgData.name in the Head title */}
            <Head title={`${orgData.name} Members`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Use orgData.name in the heading */}
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{orgData.name} Members</h2>

                <Card className="rounded-lg shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <CardTitle className="text-lg font-semibold">Organization Members</CardTitle>
                        <Link href={route('organizations.members.create', orgData.id)}>
                            <Button size="sm" className="rounded-md">
                                <Plus className="h-4 w-4 mr-2" /> Invite Member
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Use the 'members' prop directly, which is now guaranteed to be an array */}
                        {members && members.length > 0 ? (
                            <div className="overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
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
                                        {members.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">{member.email}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={member.pivot.role}
                                                        onValueChange={(value) => handleRoleChange(member, value)}
                                                        // Disable select if the current user is not an admin or if it's the user themselves
                                                        disabled={auth.user.id === member.id || member.pivot.role === 'owner'} // Assuming 'owner' role cannot be changed
                                                    >
                                                        <SelectTrigger className="w-[120px] rounded-md">
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="member">Member</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            {/* Add 'owner' if applicable and you want it selectable */}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {/* Prevent user from removing or changing role of themselves */}
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
                            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                No members in this organization yet. <Link href={route('organizations.members.create', orgData.id)} className="text-blue-600 hover:underline">Invite someone!</Link>
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Remove Member Confirmation Dialog */}
            <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Remove Member?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {memberToRemove?.name || 'this member'} from this organization?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsRemoveMemberDialogOpen(false)} className="rounded-md">Cancel</Button>
                        <Button variant="destructive" onClick={confirmRemoveMember} className="rounded-md">Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
