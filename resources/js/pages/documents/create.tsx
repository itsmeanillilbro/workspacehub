import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error'; // Corrected path
import { type Project, type BreadcrumbItem } from '@/types';


interface DocumentCreateProps {
    project: Project;
}

export default function CreateDocument({ project }: DocumentCreateProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        file: null as File | null,
        name: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: 'Upload Document', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.documents.store', project.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Upload Document for ${project.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Upload Document for {project.name}</h2>
                <Card className="w-xl mx-auto">
                    <CardHeader className='text-center'>
                        <CardTitle>Upload New Document</CardTitle>
                        <CardDescription>Select a file to upload to this project.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    name="file"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    required
                                />
                                <InputError message={errors.file} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="name">Document Name (Optional)</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name || ''}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Defaults to original filename"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button className="ms-4" disabled={processing}>
                                    Upload Document
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