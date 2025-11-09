import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  Cabinet,
  CabinetListResponse,
  AddCabinetRequest,
  CabinetDetails,
  BatteryListResponse,
  MaterialListResponse,
  AddMaterialRequest,
  Material,
  GroupListResponse,
  GroupDetail,
  AddGroupRequest,
  PlanListResponse,
  PlanDetail,
  AddPlanRequest,
  SystemConfig,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  DeviceRegistrationRequest,
  DeviceLoginRequest,
  DeviceAuthResponse,
  DeviceHeartbeatRequest,
  DeviceHeartbeatResponse,
} from '@/types/api.types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        console.error('API Error:', error.response?.data || error.message);

        // If 401 unauthorized, clear token and redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ====================

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async verifyToken(): Promise<ApiResponse<{ valid: boolean; user: User }>> {
    const response = await this.client.post('/auth/verify');
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.client.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async checkAuthStatus(): Promise<ApiResponse<{ authenticated: boolean }>> {
    const response = await this.client.get('/wscharge/auth/status');
    return response.data;
  }

  // ==================== CABINETS ====================

  async getCabinets(params?: {
    page?: number;
    page_size?: number;
    is_online?: 0 | 1;
    cabinet_id?: string;
  }): Promise<ApiResponse<CabinetListResponse>> {
    const response = await this.client.get('/wscharge/cabinets', { params });
    return response.data;
  }

  async getCabinetInfo(cabinetId: string): Promise<ApiResponse<Cabinet>> {
    const response = await this.client.get(`/wscharge/cabinets/${cabinetId}`);
    return response.data;
  }

  async addCabinet(data: AddCabinetRequest): Promise<ApiResponse> {
    const response = await this.client.post('/wscharge/cabinets', data);
    return response.data;
  }

  async updateCabinet(
    cabinetId: string,
    data: Partial<AddCabinetRequest>
  ): Promise<ApiResponse> {
    const response = await this.client.put(`/wscharge/cabinets/${cabinetId}`, data);
    return response.data;
  }

  async deleteCabinet(cabinetId: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/wscharge/cabinets/${cabinetId}`);
    return response.data;
  }

  async getCabinetDetails(cabinetId: string): Promise<ApiResponse<CabinetDetails>> {
    const response = await this.client.get(`/wscharge/cabinets/${cabinetId}/details`);
    return response.data;
  }

  async restartCabinet(cabinetId: string): Promise<ApiResponse> {
    const response = await this.client.post(`/wscharge/cabinets/${cabinetId}/command`, {
      type: 'restart',
    });
    return response.data;
  }

  async openSlot(cabinetId: string, lockId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/wscharge/cabinets/${cabinetId}/command`, {
      type: 'open',
      lock_id: lockId,
    });
    return response.data;
  }

  async openAllSlots(cabinetId: string): Promise<ApiResponse> {
    const response = await this.client.post(`/wscharge/cabinets/${cabinetId}/command`, {
      type: 'openAll',
    });
    return response.data;
  }

  // ==================== BATTERIES ====================

  async getBatteries(params?: {
    page?: number;
    page_size?: number;
  }): Promise<ApiResponse<BatteryListResponse>> {
    const response = await this.client.get('/wscharge/batteries', { params });
    return response.data;
  }

  // ==================== SCREEN MATERIALS ====================

  async getMaterials(params?: {
    page?: number;
    type?: 'image' | 'video';
  }): Promise<ApiResponse<MaterialListResponse>> {
    const response = await this.client.get('/wscharge/screen/materials', { params });
    return response.data;
  }

  async addMaterial(data: AddMaterialRequest): Promise<ApiResponse<{ id: number }>> {
    const response = await this.client.post('/wscharge/screen/materials', data);
    return response.data;
  }

  async deleteMaterial(materialId: number): Promise<ApiResponse> {
    const response = await this.client.delete(`/wscharge/screen/materials/${materialId}`);
    return response.data;
  }

  // ==================== SCREEN GROUPS ====================

  async getGroups(params?: { page?: number }): Promise<ApiResponse<GroupListResponse>> {
    const response = await this.client.get('/wscharge/screen/groups', { params });
    return response.data;
  }

  async getGroupDetail(groupId: number): Promise<ApiResponse<GroupDetail>> {
    const response = await this.client.get(`/wscharge/screen/groups/${groupId}`);
    return response.data;
  }

  async addGroup(data: AddGroupRequest): Promise<ApiResponse<{ id: number }>> {
    const response = await this.client.post('/wscharge/screen/groups', data);
    return response.data;
  }

  async updateGroup(groupId: number, data: AddGroupRequest): Promise<ApiResponse> {
    const response = await this.client.put(`/wscharge/screen/groups/${groupId}`, data);
    return response.data;
  }

  async deleteGroup(groupId: number): Promise<ApiResponse> {
    const response = await this.client.delete(`/wscharge/screen/groups/${groupId}`);
    return response.data;
  }

  // ==================== SCREEN PLANS ====================

  async getPlans(params?: { page?: number }): Promise<ApiResponse<PlanListResponse>> {
    const response = await this.client.get('/wscharge/screen/plans', { params });
    return response.data;
  }

  async getPlanDetail(planId: number): Promise<ApiResponse<PlanDetail>> {
    const response = await this.client.get(`/wscharge/screen/plans/${planId}`);
    return response.data;
  }

  async addPlan(data: AddPlanRequest): Promise<ApiResponse<{ id: number }>> {
    const response = await this.client.post('/wscharge/screen/plans', data);
    return response.data;
  }

  async updatePlan(planId: number, data: AddPlanRequest): Promise<ApiResponse> {
    const response = await this.client.put(`/wscharge/screen/plans/${planId}`, data);
    return response.data;
  }

  async deletePlan(planId: number): Promise<ApiResponse> {
    const response = await this.client.delete(`/wscharge/screen/plans/${planId}`);
    return response.data;
  }

  // ==================== SYSTEM SETTINGS ====================

  async getSystemConfig(type: string): Promise<ApiResponse<SystemConfig>> {
    const response = await this.client.get(`/wscharge/settings/${type}`);
    return response.data;
  }

  async setSystemConfig(data: {
    type: string;
    [key: string]: unknown;
  }): Promise<ApiResponse> {
    const response = await this.client.post('/wscharge/settings', data);
    return response.data;
  }

  // ==================== DEVICE AUTH & MONITORING ====================

  async registerDevice(data: DeviceRegistrationRequest): Promise<ApiResponse> {
    const response = await this.client.post('/device/auth/register', data);
    return response.data;
  }

  async deviceLogin(data: DeviceLoginRequest): Promise<DeviceAuthResponse> {
    const response = await this.client.post('/device/auth/login', data);
    return response.data;
  }

  async sendHeartbeat(data: DeviceHeartbeatRequest): Promise<DeviceHeartbeatResponse> {
    const response = await this.client.post('/device/heartbeat', data);
    return response.data;
  }

  async getDeviceStatus(cabinetId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/device/status/${cabinetId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
