import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminUserService } from '../services/adminUserService';
import { successToast, errorToast, loadingToast, infoToast } from '../../../utils/customToast';
import { confirmDialog } from '../../../utils/confirmDialog.jsx';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef(null);
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        // Marcar que necesitamos mantener el foco después de la búsqueda
        setShouldFocusSearch(document.activeElement === searchInputRef.current);
        setFilters(prev => ({ ...prev, search: searchInput }));
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Restaurar el foco después de que se actualicen los resultados
  useEffect(() => {
    if (shouldFocusSearch && searchInputRef.current && !loading) {
      searchInputRef.current.focus();
      setShouldFocusSearch(false);
    }
  }, [shouldFocusSearch, loading, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Convertir status a isActive para el backend
      if (filters.status !== '') {
        params.isActive = filters.status === 'true';
        delete params.status;
      }
      
      const response = await adminUserService.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data);
        
        // Manejar diferentes formatos de paginación del backend
        let total = response.pagination?.total || response.total;
        
        // Si no tenemos total del backend, estimarlo basado en los datos
        if (!total) {
          // Si tenemos exactamente el límite de usuarios, probablemente hay más
          if (response.data.length === pagination.limit) {
            total = response.data.length + 1; // Al menos uno más
          } else {
            total = ((pagination.page - 1) * pagination.limit) + response.data.length;
          }
        }
        
        const totalPages = response.pagination?.totalPages || Math.ceil(total / pagination.limit);
        
        setPagination(prev => ({
          ...prev,
          total: total,
          totalPages: totalPages
        }));
      } else {
        setError('No se pudieron cargar los usuarios');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const toastId = loadingToast('Actualizando rol...');
      await adminUserService.updateUserRole(userId, newRole);
      successToast('Rol actualizado exitosamente');
      fetchUsers();
    } catch (error) {
      errorToast('Error al actualizar el rol: ' + error.message);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      const toastId = loadingToast('Actualizando estado...');
      await adminUserService.updateUserStatus(userId, isActive);
      const statusText = isActive ? 'activado' : 'desactivado';
      successToast(`Usuario ${statusText} exitosamente`);
      fetchUsers();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      errorToast('Error al actualizar el estado: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleDelete = async (userId, userName) => {
    const confirmed = await confirmDialog(
      `¿Estás seguro de que quieres eliminar al usuario ${userName}?\n\nEsta acción se puede deshacer posteriormente.`,
      {
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: '#EF4444'
      }
    );
    
    if (confirmed) {
      try {
        const toastId = loadingToast('Eliminando usuario...');
        await adminUserService.deleteUser(userId);
        successToast(`Usuario ${userName} eliminado exitosamente`);
        fetchUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        errorToast('Error al eliminar el usuario: ' + (error.message || 'Error desconocido'));
      }
    }
  };

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = async (userId) => {
    try {
      const response = await adminUserService.getUserById(userId);
      if (response.success && response.data) {
        setEditingUser(response.data);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      errorToast('Error al cargar los datos del usuario: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleSaveEdit = async (userData) => {
    try {
      setLoading(true);
      
      // Actualizar usando los endpoints específicos que sabemos que funcionan
      const promises = [];
      
      // Si cambió el rol
      if (userData.role !== editingUser.role) {
        promises.push(adminUserService.updateUserRole(editingUser._id, userData.role));
      }
      
      // Si cambió el estado
      if (userData.isActive !== editingUser.isActive) {
        promises.push(adminUserService.updateUserStatus(editingUser._id, userData.isActive));
      }
      
      // Si cambió información personal (nombre, email, teléfono)
      if (userData.name !== editingUser.name || 
          userData.email !== editingUser.email || 
          userData.phone !== editingUser.phone) {
        promises.push(adminUserService.updateUser(editingUser._id, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        }));
      }
      
      // Ejecutar todas las actualizaciones
      if (promises.length > 0) {
        await Promise.all(promises);
        
        // Esperar un poco para que el backend procese
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forzar recarga de datos
        await fetchUsers();
        
        successToast('Usuario actualizado exitosamente');
      } else {
        infoToast('No se detectaron cambios');
      }
      
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      errorToast('Error al actualizar el usuario: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de usuarios</h4>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D74]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de usuarios</h4>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de usuarios</h4>
          <p className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            Total: {pagination.total} usuarios
          </p>
        </div>
        <button className="px-4 py-2 bg-[#0F0F10] text-white rounded-md text-sm hover:bg-[#E11D74] transition shadow-sm font-['Quantico',_sans-serif]">
          Crear usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los roles</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => {
              setFilters({ search: '', role: '', status: '' });
              setSearchInput('');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#F9FAFB] to-white sticky top-0 z-10 border-b border-[#E5E7EB]">
            <tr className="text-left">
              <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Usuario</th>
              <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Rol</th>
              <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Estado</th>
              <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Fecha de registro</th>
              <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-[#F9FAFB] transition-colors border-b-0">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={user.avatar} 
                          alt=""
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                        style={{ display: user.avatar ? 'none' : 'flex' }}
                      >
                        <span className="text-sm font-medium text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="p-1.5 text-gray-500 hover:text-[#E11D74] rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Editar usuario"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Eliminar usuario"
                      title="Eliminar usuario"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay usuarios que coincidan con los filtros</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {(pagination.totalPages > 1 || pagination.total > pagination.limit) && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuarios
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-md text-sm ${
                    pagination.page === page
                      ? 'bg-[#E11D74] text-white border-[#E11D74]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Editar Usuario</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                role: formData.get('role'),
                isActive: formData.get('isActive') === 'true'
              };
              handleSaveEdit(userData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11D74]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11D74]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingUser.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11D74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11D74]"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="isActive"
                    defaultValue={editingUser.isActive.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11D74]"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D74] text-white rounded-md hover:bg-[#C41E3A]"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
