import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error'; // Corrected path
import { type Project, type Task, type User, type BreadcrumbItem } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


interface TaskEditProps {
    project: Project;
    task: Task;
    organizationUsers: User[];
}

export default function EditTask({ project, task, organizationUsers }: TaskEditProps) {
    console.log({ task });
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd HH:mm:ss') : null,
        priority: task.priority,
        assigned_to_user_id: task.assigned_to_user_id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: task.title, href: route('projects.tasks.show', { project: project.id, task: task.id }) },
        { title: 'Edit', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('projects.tasks.update', { project: project.id, task: task.id }));
    };
   
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task: ${task.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight mx-auto">Edit Task: {task.title}</h2>
                <Card className="w-xl mx-auto">
                    <CardHeader className='mx-auto'>
                        <CardTitle>Edit Task Details</CardTitle>
                        <CardDescription>Update the information for this task.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="title">Task Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description || ''}
                                    className="mt-1 block w-full"
                                    rows={3}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'pending' | 'in-progress' | 'completed' | 'blocked')}
                                    >
                                        <SelectTrigger id="status" className="w-full mt-1">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="priority">Priority (0-10)</Label>
                                    <Input
                                        id="priority"
                                        type="number"
                                        name="priority"
                                        value={data.priority}
                                        className="mt-1 block w-full"
                                        min={0}
                                        max={10}
                                        onChange={(e) => setData('priority', parseInt(e.target.value))}
                                    />
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="assigned_to_user_id">Assigned To</Label>
                                <Select
                                    value={data.assigned_to_user_id?.toString() || ''}
                                    onValueChange={(value) => setData('assigned_to_user_id', value === 'none' ? null : parseInt(value))}
                                >
                                    <SelectTrigger id="assigned_to_user_id" className="mt-1 w-full">
                                        <SelectValue placeholder="Select User (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Unassigned</SelectItem>
                                        {organizationUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.assigned_to_user_id} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal mt-1",
                                                !data.due_date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.due_date ? format(new Date(data.due_date), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={data.due_date ? new Date(data.due_date) : undefined}
                                            onSelect={(date) => setData('due_date', date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.due_date} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    Update Task
                                </Button>
                            </div>
                            {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}