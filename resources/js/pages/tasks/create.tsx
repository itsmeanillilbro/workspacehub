import InputError from '@/components/input-error'; // Corrected path
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Project, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TaskCreateProps {
    project: Project;
    organizationUsers: User[];
}

export default function CreateTask({ project, organizationUsers }: TaskCreateProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        title: '',
        description: '',
        status: 'pending',
        due_date: null as string | null,
        priority: 0,
        assigned_to_user_id: null as number | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: 'Create Task', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.tasks.store', project.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Task for ${project.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Create Task for {project.name}</h2>
                <Card className="mx-auto w-xl">
                    <CardHeader className='mx-auto' >
                        <CardTitle>New Task Details</CardTitle>
                        <CardDescription>Enter the details for your new task.</CardDescription>
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

                            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'pending' | 'in-progress' | 'completed' | 'blocked')}
                                    >
                                        <SelectTrigger id="status" className="mt-1 w-full">
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
                                            variant={'outline'}
                                            className={cn(
                                                'mt-1 w-full justify-start text-left font-normal',
                                                !data.due_date && 'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.due_date ? format(new Date(data.due_date), 'PPP') : <span>Pick a date</span>}
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

                            <div className="mt-4 flex items-center justify-end">
                                <Button className="ms-4" disabled={processing}>
                                    Create Task
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
