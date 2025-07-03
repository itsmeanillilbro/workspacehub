import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type Organization, type BreadcrumbItem } from '@/types';
import { Loader2 } from 'lucide-react';

interface OrganizationEditProps {
    organization: {
        data: Organization;
    };
}

export default function EditOrganization({ organization }: OrganizationEditProps) {
    const orgData = organization.data;
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: orgData.name,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Organizations', href: route('organizations.index') },
        { title: orgData.name, href: route('organizations.show', orgData.id) },
        { title: 'Edit', active: true },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('organizations.update', orgData.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Organization: ${orgData.name}`} />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 sm:p-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight">Edit Organization</h2>
                        <p className="text-muted-foreground mt-2">
                            Update details for {orgData.name}
                        </p>
                    </div>

                    <Card className="shadow-sm">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl">Organization Details</CardTitle>
                            <CardDescription>
                                Make changes to your organization information
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
                                        className="focus-visible:ring-primary"
                                        placeholder="Enter organization name"
                                        autoComplete="organization-name"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto"
                                        disabled={processing}
                                    >
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {processing ? "Saving..." : "Save Changes"}
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