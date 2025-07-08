import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type PageProps, type Project, type BreadcrumbItem } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';


interface ProjectsIndexProps extends PageProps {
    projects: Project[];
}

export default function ProjectIndex({ projects }: ProjectsIndexProps) {
    const { auth } = usePage<ProjectsIndexProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', active: true },
    ];

  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Projects</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                {!auth.user.current_organization_id ? (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Please select an organization from the Organizations menu to view projects.</p>
                        <Link href={route('organizations.index')} className="mt-4 inline-block">
                            <Button>Go to Organizations</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Projects in {auth.user.current_organization?.name || 'Current Organization'}</h3>
                                <Link href={route('projects.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" /> Create New Project
                                    </Button>
                                </Link>
                            </div>

                            {projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map((project) => (
                                        <Card key={project.id}>
                                            <CardHeader>
                                                <CardTitle>{project.name}</CardTitle>
                                                <CardDescription>{project.description || 'No description.'}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex justify-between items-center gap-2">
                                                <Badge>{project.status}</Badge>
                                                <div className="flex gap-2">
                                                    <Link href={route('projects.show', project.id)}>
                                                        <Button className='cursor-pointer' variant="secondary" size="sm">View</Button>
                                                    </Link>
                                                    
                                                    <Link href={route('projects.edit', project.id)}>
                                                        <Button className='cursor-pointer' variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button  className='cursor-pointer' variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone. This will permanently delete your
                                                                    project "{project.name}" and all associated tasks and documents.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button variant="outline">Cancel</Button>
                                                                <Button variant="destructive"   onClick={() => router.delete(route('projects.destroy', project.id))}>Delete</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p>No projects found in this organization. <Link href={route('projects.create')} className="text-blue-600 hover:underline">Create one to get started!</Link></p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}