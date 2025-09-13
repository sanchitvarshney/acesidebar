import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import {
  Module,
  Permission,
  Role,
  Team,
  Department,
  User,
  UserModuleAccess,
  PermissionUIState,
  DEFAULT_MODULES,
} from '../types/permissionTypes';
import {
  SAMPLE_PERMISSIONS,
  SAMPLE_ROLES,
  SAMPLE_TEAMS,
  SAMPLE_DEPARTMENTS,
  SAMPLE_USERS,
} from '../data/permissionData';

interface PermissionState {
  modules: Module[];
  permissions: Permission[];
  roles: Role[];
  teams: Team[];
  departments: Department[];
  users: User[];
  userModuleAccess: UserModuleAccess[];
  uiState: PermissionUIState;
  loading: boolean;
  error: string | null;
}

type PermissionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'SET_PERMISSIONS'; payload: Permission[] }
  | { type: 'SET_ROLES'; payload: Role[] }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'SET_DEPARTMENTS'; payload: Department[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_USER_MODULE_ACCESS'; payload: UserModuleAccess[] }
  | { type: 'UPDATE_UI_STATE'; payload: Partial<PermissionUIState> }
  | { type: 'ADD_USER_ACCESS'; payload: UserModuleAccess }
  | { type: 'UPDATE_USER_ACCESS'; payload: UserModuleAccess }
  | { type: 'DELETE_USER_ACCESS'; payload: { userId: string; moduleId: string } }
  | { type: 'ADD_ROLE'; payload: Role }
  | { type: 'UPDATE_ROLE'; payload: Role }
  | { type: 'DELETE_ROLE'; payload: string };

const initialState: PermissionState = {
  modules: DEFAULT_MODULES,
  permissions: SAMPLE_PERMISSIONS,
  roles: SAMPLE_ROLES,
  teams: SAMPLE_TEAMS,
  departments: SAMPLE_DEPARTMENTS,
  users: SAMPLE_USERS,
  userModuleAccess: [],
  uiState: {
    selectedModule: null,
    selectedUser: null,
    selectedRole: null,
    showExtraPermissions: false,
    searchTerm: '',
    filterBy: 'all',
  },
  loading: false,
  error: null,
};

function permissionReducer(state: PermissionState, action: PermissionAction): PermissionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MODULES':
      return { ...state, modules: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    case 'SET_ROLES':
      return { ...state, roles: action.payload };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'SET_DEPARTMENTS':
      return { ...state, departments: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_USER_MODULE_ACCESS':
      return { ...state, userModuleAccess: action.payload };
    case 'UPDATE_UI_STATE':
      return { ...state, uiState: { ...state.uiState, ...action.payload } };
    case 'ADD_USER_ACCESS':
      return {
        ...state,
        userModuleAccess: [...state.userModuleAccess, action.payload],
      };
    case 'UPDATE_USER_ACCESS':
      return {
        ...state,
        userModuleAccess: state.userModuleAccess.map((access) =>
          access.userId === action.payload.userId && access.moduleId === action.payload.moduleId
            ? action.payload
            : access
        ),
      };
    case 'DELETE_USER_ACCESS':
      return {
        ...state,
        userModuleAccess: state.userModuleAccess.filter(
          (access) =>
            !(access.userId === action.payload.userId && access.moduleId === action.payload.moduleId)
        ),
      };
    case 'ADD_ROLE':
      return { ...state, roles: [...state.roles, action.payload] };
    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map((role) => (role.id === action.payload.id ? action.payload : role)),
      };
    case 'DELETE_ROLE':
      return {
        ...state,
        roles: state.roles.filter((role) => role.id !== action.payload),
      };
    default:
      return state;
  }
}

interface PermissionContextType {
  state: PermissionState;
  dispatch: React.Dispatch<PermissionAction>;
  // Helper functions
  getModuleById: (id: string) => Module | undefined;
  getPermissionsByModule: (moduleId: string) => Permission[];
  getRolesByModule: (moduleId: string) => Role[];
  getTeamsByModule: (moduleId: string) => Team[];
  getDepartmentsByModule: (moduleId: string) => Department[];
  getUserModuleAccess: (userId: string, moduleId: string) => UserModuleAccess | undefined;
  getUsersByModule: (moduleId: string) => User[];
  hasPermission: (userId: string, moduleId: string, permissionId: string) => boolean;
  canAccessModule: (userId: string, moduleId: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(permissionReducer, initialState);

  const getModuleById = (id: string) => state.modules.find((module) => module.id === id);

  const getPermissionsByModule = (moduleId: string) =>
    state.permissions.filter((permission) => permission.moduleId === moduleId);

  const getRolesByModule = (moduleId: string) =>
    state.roles.filter((role) => role.moduleId === moduleId);

  const getTeamsByModule = (moduleId: string) =>
    state.teams.filter((team) => team.moduleId === moduleId);

  const getDepartmentsByModule = (moduleId: string) =>
    state.departments.filter((dept) => dept.moduleId === moduleId);

  const getUserModuleAccess = (userId: string, moduleId: string) =>
    state.userModuleAccess.find(
      (access) => access.userId === userId && access.moduleId === moduleId
    );

  const getUsersByModule = (moduleId: string) => {
    const moduleAccess = state.userModuleAccess.filter(
      (access) => access.moduleId === moduleId && access.isActive
    );
    return state.users.filter((user) =>
      moduleAccess.some((access) => access.userId === user.id)
    );
  };

  const hasPermission = (userId: string, moduleId: string, permissionId: string): boolean => {
    const access = getUserModuleAccess(userId, moduleId);
    if (!access) return false;

    const role = state.roles.find((r) => r.id === access.roleId);
    if (!role) return false;

    // Check if permission is in role permissions or custom permissions
    return role.permissions.includes(permissionId) || access.customPermissions.includes(permissionId);
  };

  const canAccessModule = (userId: string, moduleId: string): boolean => {
    const access = getUserModuleAccess(userId, moduleId);
    return access ? access.isActive : false;
  };

  const value: PermissionContextType = {
    state,
    dispatch,
    getModuleById,
    getPermissionsByModule,
    getRolesByModule,
    getTeamsByModule,
    getDepartmentsByModule,
    getUserModuleAccess,
    getUsersByModule,
    hasPermission,
    canAccessModule,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};
