import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // Corrected path
import InputError from '@/components/input-error'; // Corrected path
import { type BreadcrumbItem } from '@/types';


export default function CreateProject() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        description: '',
        status: 'active',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: 'Create', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Project</h2>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>New Project Details</CardTitle>
                        <CardDescription>Enter the details for your new project within the current organization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="project-name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    rows={4}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'active' | 'completed' | 'on-hold' | 'archived')}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                    <option value="archived">Archived</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4 cursor-pointer" disabled={processing}>
                                    Create Project
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