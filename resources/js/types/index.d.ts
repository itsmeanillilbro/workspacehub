import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    current_organization_id: number | null;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Organization {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    users_count?: number; // Optional, loaded with specific query
    is_current_organization?: boolean;
    current_user_is_member?: boolean;
}
export interface Project {
    id: number;
    organization_id: number;
    user_id: number; // Creator ID
    name: string;
    description: string | null;
    status: 'active' | 'completed' | 'on-hold' | 'archived'; // Example statuses
    created_at: string;
    updated_at: string;
    creator: User; // Eager loaded relationship
    tasks_count?: number;
}
export interface Task {
    id: number;
    organization_id: number;
    project_id: number;
    assigned_to_user_id: number | null;
    created_by_user_id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked'; // Example statuses
    due_date: string | null;
    priority: number;
    created_at: string;
    updated_at: string;
    assigned_to: User | null; // Eager loaded relationship
    created_by: User; // Eager loaded relationship
    project?: Project; // Eager loaded, optional for nested views
}
export interface Document {
    id: number;
    organization_id: number;
    project_id: number;
    uploaded_by_user_id: number;
    name: string | null;
    path: string;
    url: string; // Public URL for download/preview
    mime_type: string | null;
    size: number | null; // In bytes
    created_at: string;
    updated_at: string;
    uploaded_by: User; // Eager loaded relationship
    project?: Project; // Eager loaded, optional for nested views
}