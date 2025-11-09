// API Response Types

export enum CabinetStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum PowerBankStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  CHARGING = 'CHARGING',
  MAINTENANCE = 'MAINTENANCE',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED'
}

export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST'
}

export enum TransactionType {
  RENTAL = 'RENTAL',
  DEPOSIT = 'DEPOSIT',
  REFUND = 'REFUND',
  LATE_FEE = 'LATE_FEE',
  LOST_FEE = 'LOST_FEE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

// Cabinet Types
export interface Cabinet {
  id: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  latitude: number;
  longitude: number;
  iotCardNumber?: string;
  signalStrength?: number;
  deviceId?: string;
  ipAddress?: string;
  connectionType?: 'wifi' | 'ethernet' | '4g';
  status: CabinetStatus;
  lastPingAt?: string;
  createdAt: string;
  updatedAt: string;
  slots?: Slot[];
  availablePowerBanks?: number;
  totalSlots?: number;
}

export interface Slot {
  id: string;
  cabinetId: string;
  slotNumber: string;
  powerBank?: PowerBank;
  createdAt: string;
  updatedAt: string;
}

export interface PowerBank {
  id: string;
  slotId?: string;
  batteryLevel: number;
  model?: string;
  serialNumber?: string;
  status: PowerBankStatus;
  totalRentals: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Revenue Stats Types
export interface RevenueByDay {
  date: string;
  revenue: number;
  count: number;
}

export interface RevenueByType {
  type: TransactionType;
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

// Rental Stats Types
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

// Cabinet Stats Types
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
  type: 'offline_cabinet' | 'overdue_rental' | 'low_battery' | 'damaged_powerbank' | 'maintenance_cabinet';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  cabinetId?: string;
  cabinetName?: string;
  rentalId?: string;
  powerBankId?: string;
  createdAt: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
