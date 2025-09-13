export interface Module {
  id: string;
  name: string;
  description: string;
  icon?: string;
  userCount: number;
  isActive: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  category: string;
  isDefault: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  permissions: string[]; // Permission IDs
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserModuleAccess {
  userId: string;
  moduleId: string;
  roleId: string;
  customPermissions: string[]; // Additional permissions beyond role
  teams: string[]; // Team IDs
  departments: string[]; // Department IDs
  primaryDepartment?: string;
  isActive: boolean;
}

export interface PermissionMatrix {
  roleId: string;
  roleName: string;
  permissions: {
    [permissionId: string]: boolean;
  };
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  permissions: Permission[];
  roles: Role[];
}

// Form types
export interface UserFormData {
  userId?: string;
  moduleId: string;
  roleId: string;
  customPermissions: string[];
  teams: string[];
  departments: string[];
  primaryDepartment?: string;
}

export interface RoleFormData {
  id?: string;
  name: string;
  description: string;
  moduleId: string;
  permissions: string[];
}

// UI State types
export interface PermissionUIState {
  selectedModule: string | null;
  selectedUser: string | null;
  selectedRole: string | null;
  showExtraPermissions: boolean;
  searchTerm: string;
  filterBy: 'all' | 'active' | 'inactive';
}

// Default modules
export const DEFAULT_MODULES: Module[] = [
  {
    id: 'ticket',
    name: 'Ticket Management',
    description: 'Manage support tickets and customer inquiries',
    icon: '🎫',
    userCount: 0,
    isActive: true,
  },
  {
    id: 'project',
    name: 'Project Management',
    description: 'Track projects, tasks, and team collaboration',
    icon: '📋',
    userCount: 0,
    isActive: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Integration',
    description: 'Manage WhatsApp communications and automation',
    icon: '💬',
    userCount: 0,
    isActive: true,
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Generate reports and view analytics dashboard',
    icon: '📊',
    userCount: 0,
    isActive: true,
  },
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Configure system settings and preferences',
    icon: '⚙️',
    userCount: 0,
    isActive: true,
  },
];

// Default roles
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  AGENT: 'agent',
  COLLABORATOR: 'collaborator',
} as const;

export type RoleType = typeof DEFAULT_ROLES[keyof typeof DEFAULT_ROLES];
