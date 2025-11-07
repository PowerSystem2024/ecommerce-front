import toast from 'react-hot-toast';

// Toast personalizado para success
export const successToast = (message) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-center',
  });
};

// Toast personalizado para error
export const errorToast = (message) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-center',
  });
};

// Toast personalizado para loading
export const loadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-center',
  });
};

// Toast personalizado para info
export const infoToast = (message) => {
  return toast(message, {
    duration: 4000,
    position: 'top-center',
    icon: 'ℹ️',
  });
};

// Toast para operaciones asíncronas con promesa
export const promiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Cargando...',
      success: messages.success || 'Operación exitosa',
      error: messages.error || 'Error en la operación',
    },
    {
      position: 'top-center',
      success: {
        duration: 3000,
      },
      error: {
        duration: 5000,
      },
    }
  );
};
