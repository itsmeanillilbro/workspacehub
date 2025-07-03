import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { type PageProps, type Task, type Project, type BreadcrumbItem } from '@/types';


interface TaskShowProps  extends PageProps {
    project: Project;
    task: Task;
}

export default function TaskShow({ project, task }: TaskShowProps) {
    const { flash } = usePage<TaskShowProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: task.title, active: true },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('projects.tasks.destroy', { project: project.id, task: task.id }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task: ${task.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Task: {task.title}</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Task Details
                            <div className="flex gap-2">
                                <Link href={route('projects.tasks.edit', { project: project.id, task: task.id })}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" /> Edit Task
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the task "{task.title}".
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => router.visit(route('projects.tasks.show', { project: project.id, task: task.id }))}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Part of project: <Link href={route('projects.show', project.id)} className="text-blue-600 hover:underline">
                                {project.name}
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">{task.description || 'No description provided.'}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Status:</strong> <Badge>{task.status}</Badge></p>
                            <p><strong>Priority:</strong> {task.priority}</p>
                            <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Assigned To:</strong> {task.assigned_to ? task.assigned_to.name : 'Unassigned'}</p>
                            <p><strong>Created By:</strong> {task.created_by.name}</p>
                            <p><strong>Created At:</strong> {task.created_at}</p>
                            <p><strong>Last Updated:</strong> {task.updated_at}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}