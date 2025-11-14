// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cabinet Types
export interface Cabinet {
  id?: number;
  cabinet_id: string;
  qrcode: string;
  model: 'pm8' | 'pm12' | 'pm20';
  sim?: string;
  is_online: 0 | 1;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;

  // Device monitoring fields
  lastPingAt?: string;
  signalStrength?: number;
  ipAddress?: string;
  connectionType?: 'wifi' | 'ethernet' | '4g';
  deviceId?: string;

  // API response fields
  heart_time: number; // Unix timestamp in seconds
  ip: string;
  mode?: number;
  return_num?: number;
  borrow_num?: number;
}

export interface CabinetListResponse {
  total: number;
  page?: number;
  page_size?: number;
  list: Cabinet[];
  online_num: number;
  offline_num: number;
}

export interface AddCabinetRequest {
  cabinet_id: string;
  qrcode: string;
  model: 'pm8' | 'pm12' | 'pm20';
  sim?: string;
}

export interface CabinetDetails {
  cabinet_id: string;
  is_online: 0 | 1;
  signal: 0 | 1;
  device: DeviceInfo[];
}

export interface DeviceInfo {
  bid: string;
  power: number;
  quick_charge: number;
  lock: number;
  fault: boolean;
}

// Battery Types
export interface Battery {
  id?: number;
  device_id: string;
  battery_id?: string; // Deprecated, use device_id
  power?: number;
  status?: string;
  cabinet_id?: string;
  lock_id?: number;
  create_time: number; // Unix timestamp in seconds
  created_at?: string; // Deprecated, use create_time
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
  file: string; // Backend returns "file" not "path"
  type: 'image' | 'video';
  seconds: number;
  create_time: number; // Unix timestamp
}

export interface MaterialListResponse {
  total: number;
  list: Material[];
}

export interface AddMaterialRequest {
  name?: string;
  path: string; // Backend expects "path" for upload, returns "file" in response
  type: 'image' | 'video';
}

export interface Group {
  id: number;
  group_name: string;
  create_time: number; // Unix timestamp
  material_count?: number;
}

export interface GroupDetail {
  id: number;
  group_name: string;
  details: GroupMaterialDetailWithInfo[];
  create_time: number;
}

export interface GroupMaterialDetail {
  material_id: number;
  sort: number;
  time: number;
}

export interface GroupMaterialDetailWithInfo extends GroupMaterialDetail {
  name: string;
  type: 'image' | 'video';
  file: string;
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

// Device Authentication Types
export interface DeviceRegistrationRequest {
  cabinetId: string;
  deviceId: string;
  deviceSecret: string;
}

export interface DeviceLoginRequest {
  deviceId: string;
  deviceSecret: string;
}

export interface DeviceAuthResponse {
  success: boolean;
  data?: {
    token: string;
    cabinetId: string;
    expiresIn: number;
  };
  error?: string;
}

// Device Heartbeat Types
export interface DeviceHeartbeatRequest {
  status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  signalStrength?: number;
  ipAddress?: string;
  connectionType?: 'wifi' | 'ethernet' | '4g';
  slots?: HeartbeatSlot[];
}

export interface HeartbeatSlot {
  slotNumber: number;
  isOccupied: boolean;
  powerBankId?: string;
  batteryLevel?: number;
}

export interface DeviceHeartbeatResponse {
  success: boolean;
  message?: string;
  data?: {
    cabinetId: string;
    status: string;
    lastPingAt: string;
    slotsUpdated: number;
  };
  error?: string;
}

// Revenue Statistics Types
export interface RevenueByDay {
  date: string;
  revenue: number;
  count: number;
}

export interface RevenueByType {
  type: 'RENTAL' | 'DEPOSIT' | 'REFUND' | 'LATE_FEE' | 'LOST_FEE';
  total: number;
  count: number;
}

export interface RevenueStats {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  byDay: RevenueByDay[];
  byType: RevenueByType[];
  averageTransaction: number;
}

// Rental Statistics Types
export interface RentalByDay {
  date: string;
  count: number;
  active: number;
  completed: number;
  overdue: number;
  cancelled: number;
}

export interface RentalStats {
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  overdueRentals: number;
  todayRentals: number;
  byDay: RentalByDay[];
  averageDuration: number;
}

// Cabinet Statistics Types
export interface CabinetStats {
  cabinetId: string;
  cabinetName: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  totalPowerBanks: number;
  availablePowerBanks: number;
  rentedPowerBanks: number;
  chargingPowerBanks: number;
  maintenancePowerBanks: number;
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  overdueRentals: number;
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

// Dashboard Overview Types
export interface DashboardOverview {
  cabinets: {
    total: number;
    byStatus: {
      online: number;
      offline: number;
      maintenance: number;
      outOfService: number;
    };
    totalSlots: number;
    availableSlots: number;
    totalPowerBanks: number;
    availablePowerBanks: number;
  };
  rentals: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
    today: number;
  };
  revenue: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  users: {
    total: number;
    active: number;
    newToday: number;
  };
}

// Alert Types
export interface Alert {
  id: string;
  type:
    | 'offline_cabinet'
    | 'overdue_rental'
    | 'low_battery'
    | 'damaged_powerbank'
    | 'maintenance_cabinet';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  cabinetId?: string;
  cabinetName?: string;
  rentalId?: string;
  powerBankId?: string;
  createdAt: string;
}

// Extended Cabinet type for map display
export interface CabinetWithStats extends Cabinet {
  availablePowerBanks?: number;
  totalSlots?: number;
  status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
}

// Rental Types
export type RentalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE' | 'LOST';
export type TransactionType = 'RENTAL' | 'DEPOSIT' | 'REFUND' | 'LATE_FEE' | 'LOST_FEE';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface PowerBank {
  id: string;
  serialNumber: string;
  model?: string;
  batteryCapacity?: number;
  status: 'AVAILABLE' | 'RENTED' | 'CHARGING' | 'MAINTENANCE' | 'LOST' | 'DAMAGED';
  batteryLevel?: number;
  cabinetId?: string;
  slotNumber?: number;
  totalRentals?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  rentalId?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  description?: string;
  pagoparTransactionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  userId: string;
  cabinetId: string;
  powerBankId: string;
  rentalCabinetId: string;
  returnCabinetId?: string;
  rentedAt: string;
  returnedAt?: string;
  dueAt?: string;
  basePrice: number;
  lateFee?: number;
  totalAmount?: number;
  status: RentalStatus;
  powerBank?: PowerBank;
  cabinet?: Cabinet;
  transactions?: Transaction[];
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface CreateRentalRequest {
  userId?: string; // Opcional para admin, puede crear para cualquier usuario
  cabinetId: string;
  slotNumber: number;
  paymentMethod?: 'pagopar' | 'stripe' | 'manual'; // manual = sin pago (solo admin)
}

export interface RentalListResponse {
  success: boolean;
  data: Rental[];
}

export interface RentalDetailResponse {
  success: boolean;
  data: Rental;
}
