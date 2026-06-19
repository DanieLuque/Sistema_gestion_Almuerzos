import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { AuthService } from '../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  constructor(private authService: AuthService) {}

  // Verifica si ya existe una reserva para la misma mesa y fecha (misma fecha exacta)
  async existeReservaParaMesaFecha(mesaId: string, fecha: Date): Promise<boolean> {
    const db = getFirestore();
    const reservasRef = collection(db, 'reservas');
    // Guardamos fecha como ISO o Timestamp, aquí buscamos por campo fecha igual a ISO date
    const iso = fecha.toISOString();
    const q = query(reservasRef, where('mesaId', '==', mesaId), where('fechaIso', '==', iso));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  // Crear reserva si no existe conflicto
  async crearReserva(data: { usuarioId: string; mesaId: string; fecha: Date; }) {
    const conflict = await this.existeReservaParaMesaFecha(data.mesaId, data.fecha);
    if (conflict) throw new Error('Ya existe una reserva para esa mesa y fecha');
    const db = getFirestore();
    const reservasRef = collection(db, 'reservas');
    const docRef = await addDoc(reservasRef, {
      usuarioId: data.usuarioId,
      mesaId: data.mesaId,
      fechaIso: data.fecha.toISOString(),
      fecha: Timestamp.fromDate(data.fecha),
      estado: 'activa'
    });
    return docRef.id;
  }

  // Obtener reservas del usuario (si es admin puede solicitar todas)
  async obtenerReservas(usuarioId?: string) {
    const db = getFirestore();
    const reservasRef = collection(db, 'reservas');
    if (!usuarioId) {
      // si no se pasa usuarioId devolvemos todas (usar con precaución)
      const snap = await getDocs(reservasRef);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const q = query(reservasRef, where('usuarioId', '==', usuarioId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}
