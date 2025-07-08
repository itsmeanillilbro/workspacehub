import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash } = usePage<{ flash: SharedData['flash'] }>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.warning) toast(flash.warning, { icon: '⚠️' });
        if (flash.info) toast(flash.info, { icon: 'ℹ️' });
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Default options for all toasts
                    className: '',
                    duration: 5000,
                    removeDelay: 1000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                    },

                    // Custom options per toast type
                    success: {
                        duration: 3000,
                        style: {
                            background: '#22c55e', // Tailwind green-500
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#16a34a', // green-600
                            secondary: '#000',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#ef4444', // red-500
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#b91c1c', // red-700
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        duration: 4000,
                        style: {
                            background: '#3b82f6', // blue-500
                            color: '#fff',
                        },
                    },
                    blank: {
                        duration: 4000,
                    },
                }}
            />
        </AppLayoutTemplate>
    );
}
