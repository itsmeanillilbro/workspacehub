import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error'; // Corrected path
import { type Project, type Document, type BreadcrumbItem } from '@/types';


interface DocumentEditProps {
    project: Project;
    document: Document;
}

export default function EditDocument({ project, document }: DocumentEditProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: document.name || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: document.name || 'Document Details', href: route('projects.documents.show', { project: project.id, document: document.id }) },
        { title: 'Edit', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('projects.documents.update', { project: project.id, document: document.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Document: ${document.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Document: {document.name}</h2>
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Document Details</CardTitle>
                        <CardDescription>Update the name of this document.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="name">Document Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    Update Document
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