import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Download } from 'lucide-react';
import { type PageProps, type Project, type Document, type BreadcrumbItem } from '@/types';


interface DocumentShowProps extends PageProps {
    project: Project;
    document: Document;
}

export default function DocumentShow({ project, document }: DocumentShowProps) {
    const { flash } = usePage<DocumentShowProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Projects', href: route('projects.index') },
        { title: project.name, href: route('projects.show', project.id) },
        { title: document.name || 'Document Details', active: true },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this document? This will also delete the file.')) {
            router.delete(route('projects.documents.destroy', { project: project.id, document: document.id }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Document: ${document.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Document: {document.name}</h2>
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Document Details
                            <div className="flex gap-2">
                                <a href={route('projects.documents.download', { project: project.id, document: document.id })} download={document.name || undefined}>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </Button>
                                </a>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Document
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete the document "{document.name}".
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => router.visit(route('projects.documents.show', { project: project.id, document: document.id }))}>Cancel</Button>
                                            <Button variant="destructive" onClick={()=> router.delete(route('projects.documents.destroy',{project:project.id, document:document.id}))}>Delete</Button>
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
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>File Name:</strong> {document.name}</p>
                            <p><strong>MIME Type:</strong> {document.mime_type}</p>
                            <p><strong>Size:</strong> {document.size ? (document.size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A'}</p>
                            <p><strong>Uploaded By:</strong> {document.uploaded_by.name}</p>
                            <p><strong>Uploaded At:</strong> {document.created_at}</p>
                            <p><strong>Last Updated:</strong> {document.updated_at}</p>
                        </div>
                        <div className="mt-4">
                            <p><strong>Preview (if supported):</strong></p>
                            {document.mime_type?.startsWith('image/') && (
                                <img src={document.url} alt={document.name || 'Document image'} className="max-w-full h-auto mt-2 border rounded-md" />
                            )}
                            {/* Add more preview logic for other file types if desired */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}