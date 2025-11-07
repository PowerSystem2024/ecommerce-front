import { BaseService } from './baseService';

class AdminUserService extends BaseService {
  constructor() {
    super('/admin');
  }

  // Obtener lista de usuarios
  async getUsers(params = {}) {
    return this.get('/users', params);
  }

  // Actualizar rol de usuario
  async updateUserRole(userId, role) {
    return this.put(`/users/${userId}/role`, { role });
  }

  // Actualizar estado de usuario
  async updateUserStatus(userId, isActive) {
    return this.put(`/users/${userId}/status`, { isActive });
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  async getUserById(userId) {
    return this.get(`/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.put(`/users/${userId}`, userData);
  }
}

export const adminUserService = new AdminUserService();
