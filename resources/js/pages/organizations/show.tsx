import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { type Organization, type PageProps, type Project, type User, type BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';


interface OrganizationShowProps extends PageProps {
   
    organization: { data: Organization & { users: User[] } };
    projects: Project[];
}

export default function OrganizationShow({ organization, projects }: OrganizationShowProps) {
    console.log('OrganizationShow component rendered with organization:', organization);
    const orgData = organization.data;

    const { flash } = usePage<OrganizationShowProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
    
        { title: orgData.name, active: true },
    ];
    const handleDeleteProject = (projectId: number) => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            router.delete(route('projects.destroy', projectId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Use orgData.name */}
            <Head title={`Organization: ${orgData.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Use orgData.name */}
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{orgData.name}</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Organization Details
                            <div className="flex gap-2">
                                {/* CORRECTED: Use orgData.id */}
                                <Link href={route('organizations.edit', orgData.id)}>
                                    <Button variant="outline" size="sm" className='cursor-pointer'>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Organization
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className='cursor-pointer'>
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Organization
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the organization "{orgData.name}"
                                                and all its associated projects, tasks, and documents.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                {/* CORRECTED: Use orgData.id */}
                                            <Button variant="outline" onClick={() => router.visit(route('organizations.show', orgData.id))}>Cancel</Button>
                                {/* CORRECTED: Use orgData.id */}
                                            <Button variant="destructive" onClick={() => router.delete(route('organizations.destroy', orgData.id))}>Delete</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardTitle>
                        {/* Use orgData.created_at */}
                        <CardDescription>Created on: {orgData.created_at}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Members:</h4>
                            {/* Use orgData.users */}
                            {orgData.users.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {orgData.users.map(member => (
                                        <li key={member.id}>{member.name} ({member.email})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No members yet.</p>
                            )}
                            {/* Use orgData.id */}
                            <Link href={route('organizations.members.index', orgData.id)} className="mt-2 inline-block">
                                <Button variant="link" size="sm" className='cursor-pointer'>Manage Members</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Projects Section */}
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Projects</CardTitle>
                        <Link href={route('projects.create')}>
                            <Button size="sm" className='cursor-pointer'>
                                <Plus className="h-4 w-4 mr-2" /> New Project
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {projects.length > 0 ? (
                            <ul className="space-y-4">
                                {projects.map((project) => (
                                    <li key={project.id} className="p-4 border rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-700">
                                        <div>
                                            <h4 className="font-semibold text-lg">{project.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{project.description || 'No description.'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Status: {project.status}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Created by: {project.creator.name}</p>
                                        </div>
                                        <div className="flex gap-2 ">
                                            <Link href={route('projects.show', project.id)}>
                                                <Button  variant="outline" size="sm">View</Button>
                                            </Link>
                                            <Link href={route('projects.edit', project.id)}>
                                                <Button  className='cursor-pointer' variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                                            </Link>
                                            <Button  className='cursor-pointer' variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No projects yet for this organization. <Link href={route('projects.create')} className="text-blue-600 hover:underline">Create one!</Link></p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}