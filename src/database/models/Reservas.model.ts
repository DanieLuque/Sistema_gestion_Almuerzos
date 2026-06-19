export interface Reserva {
  id: string;
  usuarioId: string;
  mesaId: string;
  fecha: Date;
  estado: 'activa' | 'cancelada' | 'finalizada';
}