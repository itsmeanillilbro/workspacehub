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


interface OrganizationMembersIndexProps extends PageProps {
    organization: Organization;
    members: (User & { pivot: { role: string } })[];
}

export default function OrganizationMembersIndex({ organization, members }: OrganizationMembersIndexProps) {
    const { auth } = usePage<OrganizationMembersIndexProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        { title: organization.name, href: route('organizations.show', organization.id) },
        { title: 'Members', active: true },
    ];

    const handleRemoveMember = (member: User) => {
        if (confirm(`Are you sure you want to remove ${member.name} from this organization?`)) {
            router.delete(route('organizations.members.destroy', { organization: organization.id, member: member.id }));
        }
    };

    const handleRoleChange = (member: User, newRole: string) => {
        router.put(route('organizations.members.update', { organization: organization.id, member: member.id }), {
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
            <Head title={`${organization.name} Members`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{organization.name} Members</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Organization Members</CardTitle>
                        <Link href={route('organizations.members.create', organization.id)}>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Invite Member
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {members.length > 0 ? (
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
                                            <TableCell>{member.name}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={member.pivot.role}
                                                    onValueChange={(value) => handleRoleChange(member, value)}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="member">Member</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {auth.user.id !== member.id && ( // Prevent user from removing themselves directly
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Remove Member?</DialogTitle>
                                                                <DialogDescription>
                                                                    Are you sure you want to remove {member.name} from this organization?
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button variant="outline">Cancel</Button>
                                                                <Button variant="destructive" onClick={() => handleRemoveMember(member)}>Remove</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No members in this organization yet. <Link href={route('organizations.members.create', organization.id)} className="text-blue-600 hover:underline">Invite someone!</Link></p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}