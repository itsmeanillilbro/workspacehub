import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Download } from 'lucide-react';
import { type PageProps, type Project, type Task, type Document, type BreadcrumbItem } from '@/types';


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

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{project.name}</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Project Details
                            <div className="flex gap-2">
                                <Link href={route('projects.edit', project.id)}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" /> Edit Project
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                                        </Button>
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
                                            <Button variant="outline" onClick={() => router.visit(route('projects.show', project.id))}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleDeleteProject}>Delete</Button>
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
                        <p className="text-gray-700 dark:text-gray-300 mb-2">{project.description || 'No description provided.'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status: <Badge>{project.status}</Badge></p>
                    </CardContent>
                </Card>

                {/* Tasks Section */}
                <Card className="mb-6">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Tasks</CardTitle>
                        <Link href={route('projects.tasks.create', project.id)}>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" /> New Task
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {tasks.length > 0 ? (
                            <ul className="space-y-4">
                                {tasks.map((task) => (
                                    <li key={task.id} className="p-4 border rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-700">
                                        <div>
                                            <h4 className="font-semibold text-lg">{task.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="mr-2">Status: <Badge>{task.status}</Badge></span>
                                                {task.due_date && <span className="mr-2">Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                                                {task.assigned_to && <span>Assigned to: {task.assigned_to.name}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={route('projects.tasks.show', { project: project.id, task: task.id })}>
                                                <Button variant="outline" size="sm">View</Button>
                                            </Link>
                                            <Link href={route('projects.tasks.edit', { project: project.id, task: task.id })}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
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
                                                        <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tasks yet for this project. <Link href={route('projects.tasks.create', project.id)} className="text-blue-600 hover:underline">Add one!</Link></p>
                        )}
                    </CardContent>
                </Card>

                {/* Documents Section */}
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Documents</CardTitle>
                        <Link href={route('projects.documents.create', project.id)}>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Upload Document
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {documents.length > 0 ? (
                            <ul className="space-y-4">
                                {documents.map((document) => (
                                    <li key={document.id} className="p-4 border rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-700">
                                        <div>
                                            <h4 className="font-semibold text-lg">{document.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {document.mime_type} - { (document.size ? (document.size / (1024 * 1024)).toFixed(2) : 'N/A') } MB
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded by {document.uploaded_by.name} on {document.created_at}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={route('projects.documents.download', { project: project.id, document: document.id })} download={document.name || undefined}>
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4 mr-2" /> Download
                                                </Button>
                                            </a>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot be undone. This will permanently delete the document "{document.name}".
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button variant="destructive" onClick={() => handleDeleteDocument(document.id)}>Delete</Button>
                                                    </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No documents yet for this project. <Link href={route('projects.documents.create', project.id)} className="text-blue-600 hover:underline">Upload one!</Link></p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            {/* </div> */}
        </AppLayout>
    );
}