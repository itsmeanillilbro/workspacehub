// resources/js/Pages/Tasks/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
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
import { type Project, type Task, type BreadcrumbItem, type TasksIndexProps } from '@/types';
import React from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';


export default function TasksIndex({ project, tasks }: TasksIndexProps) {
    // CORRECTED: projectData now directly refers to the 'project' prop
    const projectData = project;
    // Extract the actual tasks array from the 'data' wrapper
    const tasksList = tasks.data;

    // State for the delete task confirmation dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        // Assuming project has organization_id and you can get organization name/id from it
        // This might need adjustment if you don't pass organization info with the project
        { title: projectData.name, href: route('projects.show',{project:projectData.id} ) },
        { title: 'Tasks', active: true },
    ];

    // Function to open the delete task dialog
    const openDeleteDialog = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteDialogOpen(true);
    };

    // Function to handle the actual task deletion after confirmation
    const confirmDeleteTask = () => {
        if (taskToDelete && projectData.id) {
            router.delete(route('projects.tasks.destroy', { project: projectData.id, task: taskToDelete.id }), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false); // Close dialog on success
                    setTaskToDelete(null); // Clear the task to delete
                },
                onError: (errors) => {
                    console.error('Error deleting task:', errors);
                    setIsDeleteDialogOpen(false); // Close dialog even on error
                    setTaskToDelete(null);
                    // Optionally display a toast or flash message here
                },
            });
        } else {
            console.error("Cannot delete task: Project data or task data is missing.");
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tasks for ${projectData.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tasks for {projectData.name}</h2>

                <Card className="rounded-lg shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <CardTitle className="text-lg font-semibold">Project Tasks</CardTitle>
                        <Link href={route('projects.tasks.create', {project:projectData.id})}>
                            <Button size="sm" className="rounded-md">
                                <Plus className="h-4 w-4 mr-2" /> New Task
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        {Array.isArray(tasksList) && tasksList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasksList.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.title}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                                        ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                                        ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                                        ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                                                        ${task.status === 'blocked' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                                                    `}>
                                                        {task.status.replace(/_/g, ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{task.due_date || 'N/A'}</TableCell>
                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Link href={route('projects.tasks.show', { project: projectData.id, task: task.id })}>
                                                        <Button variant="outline" size="sm">View</Button>
                                                    </Link>
                                                    <Link href={route('projects.tasks.edit', { project: projectData.id, task: task.id })}>
                                                        <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-md"
                                                        onClick={() => openDeleteDialog(task)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                No tasks for this project yet. <Link href={route('projects.tasks.create', {project:projectData.id})} className="text-blue-600 hover:underline">Create one!</Link>
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Task Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Delete Task?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the task "{taskToDelete?.title || 'this task'}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-md">Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteTask} className="rounded-md">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
