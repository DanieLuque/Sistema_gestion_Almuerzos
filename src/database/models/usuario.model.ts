export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente';
  activo: boolean;
  fechaCreacion: Date;
}