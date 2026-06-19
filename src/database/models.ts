/**
 * Database Models para Firestore
 * Sincronizado con estructura de colecciones en Firebase
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  icon: string;
  category: 'carnes' | 'vegetarianos' | 'pescados' | 'bajo-calorias';
  disponible: boolean;
  imagen?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface PedidoItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  userId: string;
  items: PedidoItem[];
  total: number;
  status: 'pendiente' | 'procesando' | 'entregado' | 'cancelado';
  statusLabel: string;
  progress: number;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  notas?: string;
}

export interface Reserva {
  id: string;
  userId: string;
  menu: string;
  description: string;
  date: string;
  time: string;
  pessoas: number;
  location: string;
  price: number;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  statusLabel: string;
  createdAt: Date;
  updatedAt: Date;
  notas?: string;
}

export interface Usuario {
  id: string;
  uid: string; // Firebase Auth UID
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin' | 'gerente';
  activo: boolean;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface DashboardStats {
  almuerzos_pendientes: number;
  reservas_confirmadas: number;
  usuarios_activos: number;
  ingresos_mes: number;
  pedidos_entregados: number;
  tasa_satisfaccion: number;
}

export interface PedidosStats {
  total: number;
  procesando: number;
  entregados: number;
  cancelados: number;
  totalGastado: number;
}

export interface ReservasStats {
  total: number;
  confirmadas: number;
  pendientes: number;
  canceladas: number;
  proximasPersonas: number;
}
