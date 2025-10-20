// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ProtectedRoute({ user, isAdmin, children }) {
  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <AnimatePresence>
        <motion.div
          key="no-permisos"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4"
          >
            <p className="text-red-600 font-bold text-lg mb-4">
              ❌ No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Volver al inicio
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return children;
}
