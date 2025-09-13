# Multi-Module Permission System

This directory contains the comprehensive multi-module permission system for the TMS (Ticket Management System) project.

## Overview

The permission system provides a complete solution for managing user access, roles, and permissions across multiple modules in your TMS application. It includes:

- **Admin Dashboard** - Central hub for managing all modules and permissions
- **User Management** - Step-by-step user assignment with role and permission management
- **Role Management** - Create and manage roles with specific permissions
- **Permission Visualization** - Matrix view of roles vs permissions
- **Team Management** - Manage teams and departments

## Features

### 1. Admin Dashboard (`AdminDashboard.tsx`)
- Module cards showing available projects/modules
- Quick action buttons for common tasks
- User count per module
- Recent activity overview

### 2. User Management (`UserManagement.tsx`)
A comprehensive 6-step process for managing user access:

1. **Select Module** - Choose the project/module
2. **Select User** - Choose or add a user
3. **Assign Role** - Set user role and view default permissions
4. **Extra Permissions** - Add custom permissions beyond role defaults
5. **Teams & Departments** - Assign organizational units
6. **Review & Save** - Confirm and save changes

### 3. Role Management (`RoleManagement.tsx`)
- Create and edit roles
- Assign module-specific permissions
- Filter by module
- Permission categorization

### 4. Permission Visualization (`PermissionVisualization.tsx`)
- Matrix view of roles vs permissions
- Filter by module and search
- Permission details with role assignments
- Interactive legend

### 5. Team Management (`TeamManagement.tsx`)
- Manage teams and departments
- Module-specific organization
- Active/inactive status management

## Components

### Reusable Components (`src/components/permission/`)

- **`PermissionCheckbox.tsx`** - Individual permission checkbox with tooltips
- **`PermissionMatrix.tsx`** - Matrix visualization component
- **`ModuleCard.tsx`** - Module display card component

## Data Structure

### Types (`src/types/permissionTypes.ts`)

- **Module** - System modules (Ticket, Project, WhatsApp, etc.)
- **Permission** - Individual permissions with categories
- **Role** - User roles with assigned permissions
- **Team** - Organizational teams
- **Department** - Organizational departments
- **User** - System users
- **UserModuleAccess** - User access per module

### Sample Data (`src/data/permissionData.ts`)

Pre-populated with sample data for testing:
- 20+ permissions across 5 modules
- 6 default roles
- 4 teams and 5 departments
- 5 sample users

## Context Management

### PermissionContext (`src/contextApi/PermissionContext.tsx`)

Centralized state management for:
- Modules, permissions, roles, teams, departments, users
- User module access assignments
- UI state management
- Helper functions for permission checks

## Usage

### 1. Access Admin Dashboard
Navigate to `/admin` to access the admin dashboard.

### 2. Manage Users
Go to `/admin/user-management` to assign users to modules with specific roles and permissions.

### 3. Manage Roles
Visit `/admin/role-management` to create and configure roles.

### 4. View Permissions
Check `/admin/permission-visualization` to see the complete permission matrix.

### 5. Manage Teams
Access `/admin/team-management` to organize users into teams and departments.

## Permission Flow

1. **Module Selection** - Choose which module to manage
2. **User Assignment** - Select users for the module
3. **Role Assignment** - Assign appropriate roles
4. **Custom Permissions** - Add extra permissions as needed
5. **Organization** - Assign teams and departments
6. **Activation** - Save and activate the configuration

## Key Features

- **Multi-Module Support** - Each module can have its own permissions and roles
- **Granular Permissions** - Fine-grained control over user capabilities
- **Role Inheritance** - Default permissions with custom overrides
- **Team Organization** - Group users into teams and departments
- **Visual Management** - Intuitive UI for complex permission management
- **Search & Filter** - Easy navigation through large permission sets

## Integration

The permission system integrates with your existing TMS through:

- **Context Provider** - Wraps the entire application
- **Route Protection** - Based on user permissions
- **Component-Level Access** - Show/hide features based on permissions
- **API Integration** - Ready for backend integration

## Customization

### Adding New Modules
1. Add module to `DEFAULT_MODULES` in `permissionTypes.ts`
2. Create module-specific permissions in `permissionData.ts`
3. Add module to routing if needed

### Adding New Permissions
1. Add permission to `SAMPLE_PERMISSIONS` in `permissionData.ts`
2. Assign to appropriate roles
3. Update permission categories as needed

### Customizing UI
- Modify component styles in individual files
- Update the step flow in `UserManagement.tsx`
- Customize the permission matrix display

## Future Enhancements

- **Audit Logging** - Track permission changes
- **Bulk Operations** - Mass user/role assignments
- **Permission Templates** - Pre-configured permission sets
- **Advanced Filtering** - More sophisticated search options
- **Export/Import** - Backup and restore configurations
