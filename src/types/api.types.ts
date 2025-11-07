// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cabinet Types
export interface Cabinet {
  id: number;
  cabinet_id: string;
  qrcode: string;
  model: 'pm8' | 'pm12' | 'pm20';
  sim?: string;
  is_online: 0 | 1;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at?: string;
}

export interface CabinetListResponse {
  total: number;
  page: number;
  page_size: number;
  list: Cabinet[];
}

export interface AddCabinetRequest {
  cabinet_id: string;
  qrcode: string;
  model: 'pm8' | 'pm12' | 'pm20';
  sim?: string;
}

export interface CabinetDetails {
  cabinet_id: string;
  slots: SlotInfo[];
}

export interface SlotInfo {
  lock_id: number;
  status: number;
  battery_power?: number;
  battery_id?: string;
}

// Battery Types
export interface Battery {
  id: number;
  battery_id: string;
  power: number;
  status: string;
  cabinet_id?: string;
  lock_id?: number;
  created_at: string;
}

export interface BatteryListResponse {
  total: number;
  page: number;
  page_size: number;
  list: Battery[];
}

// Screen Advertising Types
export interface Material {
  id: number;
  name: string;
  path: string;
  type: 'image' | 'video';
  created_at: string;
}

export interface MaterialListResponse {
  total: number;
  page: number;
  page_size: number;
  list: Material[];
}

export interface AddMaterialRequest {
  name: string;
  path: string;
  type: 'image' | 'video';
}

export interface Group {
  id: number;
  name: string;
  created_at: string;
  material_count?: number;
}

export interface GroupDetail {
  id: number;
  name: string;
  details: GroupMaterialDetail[];
}

export interface GroupMaterialDetail {
  material_id: number;
  material_name?: string;
  material_path?: string;
  sort: number;
  time: number;
}

export interface GroupListResponse {
  total: number;
  page: number;
  page_size: number;
  list: Group[];
}

export interface AddGroupRequest {
  name: string;
  details: {
    material_id: number;
    sort: number;
    time: number;
  }[];
}

export interface Plan {
  id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  equipment_group: string;
  created_at: string;
}

export interface PlanDetail {
  id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  equipment_group: string;
  details: PlanScheduleDetail[];
}

export interface PlanScheduleDetail {
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  group_id: number;
  group_name?: string;
}

export interface PlanListResponse {
  total: number;
  page: number;
  page_size: number;
  list: Plan[];
}

export interface AddPlanRequest {
  plan_name: string;
  start_date: string;
  end_date: string;
  details: {
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    group_id: number;
  }[];
  equipment_group: string;
}

// System Settings Types
export interface SystemConfig {
  type: 'battery_power' | 'webhook' | 'qrcode_color' | 'screen_default';
  value: string | number | Record<string, unknown>;
}

// Statistics Types
export interface DashboardStats {
  totalCabinets: number;
  onlineCabinets: number;
  totalBatteries: number;
  availableBatteries: number;
  activePlans: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    expiresIn: number;
  };
  error?: string;
}
