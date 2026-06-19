/**
 * FIRESTORE COLLECTIONS SETUP
 * Instrucciones para crear las colecciones en Firebase Console
 * 
 * Accede a: https://console.firebase.google.com
 * Proyecto: sistemagestionalmuerzos
 */

// ============================================
// COLECCIÓN: usuarios
// ============================================
// Documento de ejemplo:
{
  id: "user123",
  uid: "firebase_auth_uid",
  nombre: "Juan Pérez",
  email: "juan@example.com",
  rol: "cliente",  // "cliente" | "admin" | "gerente"
  activo: true,
  telefono: "555-1234",
  direccion: "Calle Principal 123",
  createdAt: Timestamp(2024-06-19),
  updatedAt: Timestamp(2024-06-19),
  lastLogin: Timestamp(2024-06-19)
}

// ============================================
// COLECCIÓN: menus
// ============================================
// Documento de ejemplo:
{
  name: "Pollo a la Brasa",
  description: "Pollo marinado con especias, servido con papas y ensalada",
  price: 12.50,
  rating: 4.8,
  icon: "🍗",
  category: "carnes",  // "carnes" | "vegetarianos" | "pescados" | "bajo-calorias"
  disponible: true,
  imagen: "url_imagen",
  createdAt: Timestamp(2024-06-19),
  updatedAt: Timestamp(2024-06-19)
}

// ============================================
// COLECCIÓN: pedidos
// ============================================
// Documento de ejemplo:
{
  userId: "user123",
  items: [
    {
      id: "menu123",
      name: "Pollo a la Brasa",
      price: 12.50,
      quantity: 2,
      subtotal: 25.00
    }
  ],
  total: 25.00,
  status: "pendiente",  // "pendiente" | "procesando" | "entregado" | "cancelado"
  statusLabel: "Pendiente",
  progress: 0,
  date: "19/06/2024",
  time: "12:30",
  notas: "Sin cebolla, por favor",
  createdAt: Timestamp(2024-06-19),
  updatedAt: Timestamp(2024-06-19)
}

// ============================================
// COLECCIÓN: reservas
// ============================================
// Documento de ejemplo:
{
  userId: "user123",
  menu: "Almuerzo Ejecutivo",
  description: "Menú especial para reunión de equipo",
  date: "22/06/2024",
  time: "13:00",
  pessoas: 10,
  location: "Oficina - Sala de Conferencias",
  price: 125.00,
  status: "confirmada",  // "pendiente" | "confirmada" | "cancelada"
  statusLabel: "Confirmada",
  notas: "Preparar bebidas frías",
  createdAt: Timestamp(2024-06-19),
  updatedAt: Timestamp(2024-06-19)
}

// ============================================
// REGLAS DE SEGURIDAD (Firestore Rules)
// ============================================
// IMPORTANTE: Configurar estas reglas en Firebase Console
// Database Rules > Firestore Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios solo pueden leer/escribir su propio documento
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Menús: todos pueden leer, solo admin puede escribir
    match /menus/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }
    
    // Pedidos: solo el propietario puede leer/escribir
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Reservas: solo el propietario puede leer/escribir
    match /reservas/{reservaId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}

// ============================================
// PASOS PARA CONFIGURAR EN FIREBASE CONSOLE
// ============================================

// 1. CREAR COLECCIONES
//    - Ve a Firestore Database
//    - Click en "Crear colección"
//    - Nombres: usuarios, menus, pedidos, reservas
//    - Agrega documentos de ejemplo usando los modelos arriba

// 2. CREAR USUARIO DE EJEMPLO
//    - Ve a Authentication
//    - Click en "Agregar usuario"
//    - Email: test@example.com
//    - Contraseña: Test123456

// 3. CREAR DOCUMENTO DE USUARIO EN FIRESTORE
//    - Ve a Firestore
//    - Colección: usuarios
//    - Nuevo documento con uid del usuario de Auth
//    - Completa datos: nombre, email, rol, etc.

// 4. AGREGAR MENÚS DE EJEMPLO
//    - Ve a Firestore > menus
//    - Agrega 5-10 items diferentes

// 5. CONFIGURAR REGLAS DE SEGURIDAD
//    - Ve a Firestore > Reglas
//    - Copia y pega las reglas de arriba
//    - Publica

// ============================================
// TESTING EN DESARROLLO
// ============================================

// Para probar con datos simulados en desarrollo:
// - Usa Firebase Emulator Suite
// - O crea usuarios de prueba en Firebase Console

// Comando para iniciar emulators:
// firebase emulators:start

// El app se conectará automáticamente a emulators si están activos
