import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { OrganizationResponse, type BreadcrumbItem, type Organization, type PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface OrganizationsIndexProps extends PageProps {
    organizations: OrganizationResponse;
    currentOrganizationId: number | null;
}

export default function OrganizationIndex({ organizations, currentOrganizationId }: OrganizationsIndexProps) {
    const { auth } = usePage<OrganizationsIndexProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', active: true },
    ];



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizations" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Organizations</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-medium">Your Organizations</h3>
                            <Link href={route('organizations.create')}>
                                <Button className='cursor-pointer' >
                                    <Plus className="mr-2 h-4 w-4 " /> Create New Organization
                                </Button>
                            </Link>
                        </div>

                        {organizations.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {organizations.data.map((org) => (
                                    <Card key={org.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                {org.name}
                                                {org.is_current_organization && (
                                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        Current
                                                    </span>
                                                )}
                                            </CardTitle>
                                            <CardDescription>{org.users_count || 0} Members</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex justify-end gap-2">
                                            {!org.is_current_organization && (
                                                <Link href={route('organizations.switch', org.id)} method="post" as="button">
                                                    <Button variant="outline" size="sm" className='cursor-pointer'>
                                                        Switch
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link href={route('organizations.show', org.id)}>
                                                <Button variant="secondary" size="sm" className='cursor-pointer'>
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={route('organizations.edit', org.id)}>
                                                <Button variant="outline" size="sm" className='cursor-pointer'>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" className='cursor-pointer'>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot be undone. This will permanently delete the organization "{org.name}"
                                                            and all its associated projects, tasks, and documents.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button variant="destructive"  onClick={() => router.delete(route('organizations.destroy', org.id))}>
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p>You are not a member of any organization yet. Create one to get started!</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
