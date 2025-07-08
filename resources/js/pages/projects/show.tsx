import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Document, type PageProps, type Project, type Task } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface ProjectShowProps extends PageProps {
    project: Project;
    tasks: Task[];
    documents: Document[];
}

export default function ProjectShow({ project, tasks, documents }: ProjectShowProps) {
    const { flash } = usePage<ProjectShowProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, active: true },
    ];

    const handleDeleteProject = () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    const handleDeleteTask = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('projects.tasks.destroy', { project: project.id, task: taskId }));
        }
    };

    const handleDeleteDocument = (documentId: number) => {
        if (confirm('Are you sure you want to delete this document? This will also delete the file.')) {
            router.delete(route('projects.documents.destroy', { project: project.id, document: documentId }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project: ${project.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">{project.name}</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Project Details
                            <div className="flex gap-2">
                                <Link href={route('projects.edit', project.id)}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" /> Edit Project
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your project "{project.name}" and all
                                                associated tasks and documents.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => router.visit(route('projects.show', project.id))}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={() => router.delete(route('projects.destroy', project.id))}>
                                                Delete
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Created by {project.creator.name} on {project.created_at}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 text-gray-700 dark:text-gray-300">{project.description || 'No description provided.'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: <Badge>{project.status}</Badge>
                        </p>
                    </CardContent>
                </Card>

                {/* Tasks Section */}
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Tasks</CardTitle>
                        <Link href={route('projects.tasks.create', project.id)}>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> New Task
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {tasks.length > 0 ? (
                            <ul className="space-y-4">
                                {tasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between rounded-md border bg-gray-50 p-4 dark:bg-gray-700">
                                        <div>
                                            <h4 className="text-lg font-semibold">{task.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="mr-2">
                                                    Status: <Badge>{task.status}</Badge>
                                                </span>
                                                {task.due_date && <span className="mr-2">Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                                                {task.assigned_to?.data?.name && <span>Assigned to: {task.assigned_to.data.name}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={route('projects.tasks.show', { project: project.id, task: task.id })}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={route('projects.tasks.edit', { project: project.id, task: task.id })}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
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
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                router.delete(route('projects.tasks.destroy', { project: project.id, task: task.id }))
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                No tasks yet for this project.{' '}
                                <Link href={route('projects.tasks.create', project.id)} className="text-blue-600 hover:underline">
                                    Add one!
                                </Link>
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Documents Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Documents</CardTitle>
                        <Link href={route('projects.documents.create', project.id)}>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Upload Document
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {documents.length > 0 ? (
                            <ul className="space-y-4">
                                {documents.map((document) => (
                                    <li
                                        key={document.id}
                                        className="flex items-center justify-between rounded-md border bg-gray-50 p-4 dark:bg-gray-700"
                                    >
                                        <div>
                                            <h4 className="text-lg font-semibold">{document.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {document.mime_type} - {document.size ? (document.size / (1024 * 1024)).toFixed(2) : 'N/A'} MB
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Uploaded by {document.uploaded_by.name} on {document.created_at}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* View */}
                                            <a
                                                href={route('projects.documents.show', { project: project.id, document: document.id })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="secondary" size="sm">
                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                </Button>
                                            </a>

                                            {/* Download */}
                                            <a
                                                href={route('projects.documents.download', { project: project.id, document: document.id })}
                                                download={document.name || undefined}
                                            >
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </Button>
                                            </a>

                                            {/* Delete */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription>
                                                            This will permanently delete the document "{document.name}".
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                router.delete(
                                                                    route('projects.documents.destroy', {
                                                                        project: project.id,
                                                                        document: document.id,
                                                                    }),
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                No documents yet for this project.{' '}
                                <Link href={route('projects.documents.create', project.id)} className="text-blue-600 hover:underline">
                                    Upload one!
                                </Link>
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* </div> */}
        </AppLayout>
    );
}
