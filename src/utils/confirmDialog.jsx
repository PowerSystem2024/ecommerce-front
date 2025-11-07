import toast from 'react-hot-toast';

/**
 * Muestra un diálogo de confirmación personalizado usando toast
 * @param {string} message - Mensaje de confirmación
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<boolean>} - true si el usuario confirma, false si cancela
 */
export const confirmDialog = (message, options = {}) => {
  return new Promise((resolve) => {
    const {
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      confirmColor = '#E11D74',
      cancelColor = '#6B7280',
      duration = 0, // 0 = no se cierra automáticamente
    } = options;

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 whitespace-pre-line">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-t border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="w-full border-r border-gray-200 rounded-bl-lg px-4 py-3 flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors"
              style={{ color: cancelColor }}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="w-full rounded-br-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: confirmColor }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration,
        position: 'top-center',
      }
    );
  });
};
