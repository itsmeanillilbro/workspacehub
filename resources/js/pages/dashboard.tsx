import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth, flash } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Flash messages are handled by AppLayout now, no need for explicit Alert here */}

                {auth.user.current_organization_id ? (
                    <>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                                        Welcome to {auth.user.current_organization?.name || 'Your Organization'}!
                                    </h3>
                                </div>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <Link href={route('projects.index')}>
                                        <Button size="lg" className="w-full">View Projects</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <Link href={route('organizations.index')}>
                                        <Button size="lg" variant="outline" className="w-full">Manage Organizations</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            <div className="absolute inset-0 flex items-center justify-center p-4 text-neutral-700 dark:text-neutral-300">
                                <p>This area can be used for a summary of current tasks, recent activities, or quick links.</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border flex flex-col items-center justify-center text-center p-6">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                                No Active Organization Selected
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Please select or create an organization to start managing projects and tasks.
                            </p>
                            <Link href={route('organizations.index')}>
                                <Button size="lg">Go to Organizations</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}