import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Loader2 } from 'lucide-react';

export default function CreateOrganization() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        { title: 'Create', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('organizations.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Organization" />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 sm:p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight">Create New Organization</h2>
                        <p className="text-muted-foreground mt-2">
                            Get started by setting up your organization
                        </p>
                    </div>

                    <Card className="shadow-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl">Organization Details</CardTitle>
                            <CardDescription>
                                Enter a name for your organization
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="focus-visible:ring-primary mt-2"
                                        placeholder="e.g. Acme Corp"
                                        autoComplete="organization-name"
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="flex justify-end">
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto  cursor-pointer"
                                        disabled={processing}
                                    >
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {processing ? "Creating..." : "Create Organization"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}