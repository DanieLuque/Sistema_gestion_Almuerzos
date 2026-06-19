# 🍽️ Sistema de Gestión de Almuerzos

Aplicación web para gestionar y reservar almuerzos, permitiendo a los usuarios navegar un menú de comidas, realizar pedidos, crear reservas y rastrear sus órdenes en tiempo real.

---

## 👥 **Integrantes**

- **Hugo Mancera**
- **Daniel Luque**

---

## 📋 **Descripción**

El Sistema de Gestión de Almuerzos es una plataforma moderna que permite:

✅ **Usuarios:**
- Registrarse y autenticarse de forma segura
- Ver catálogo de menús disponibles
- Agregar items al carrito de compras
- Crear pedidos de almuerzos
- Crear reservas para eventos
- Rastrear estado de pedidos y reservas
- Ver estadísticas de compras

✅ **Administradores:**
- Gestionar menús disponibles
- Actualizar estado de pedidos
- Ver estadísticas de ingresos y ventas

---

## 🛠️ **Tecnología**

- **Frontend:** Angular 18 (Standalone Components)
- **Estilos:** Tailwind CSS
- **Base de Datos:** Firebase Firestore
- **Autenticación:** Firebase Authentication
- **Lenguaje:** TypeScript
- **Package Manager:** npm

---

## 📁 **Estructura del Proyecto**

```
Sistema_gestion_Almuerzos/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios centrales
│   │   │   ├── services/      # AuthService, MenuService, PedidosService, ReservasService, DashboardService
│   │   │   └── guards/        # AuthGuard
│   │   ├── features/          # Módulos funcionales (lazy-loaded)
│   │   │   ├── auth/          # Login, Registro, Forgot Password
│   │   │   ├── menu/          # Catálogo de comidas
│   │   │   ├── pedidos/       # Mis pedidos
│   │   │   ├── reservas/      # Mis reservas
│   │   │   └── dashboard/     # Panel de control
│   │   ├── shared/            # Componentes reutilizables
│   │   │   ├── components/    # Navbar, Footer, SearchBar, etc.
│   │   │   └── animations/    # Triggers de animaciones
│   │   └── app.routes.ts      # Rutas principales
│   ├── database/
│   │   ├── firebase.config.ts # Configuración de Firebase
│   │   └── models.ts          # Interfaces de TypeScript
│   ├── environments/          # Configuración por entorno
│   ├── styles.css             # Estilos globales
│   └── main.ts                # Bootstrap de la app
├── angular.json               # Configuración Angular
├── tailwind.config.js         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

---

## 🚀 **Instalación y Uso**

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/DanieLuque/Sistema_gestion_Almuerzos.git
cd Sistema_gestion_Almuerzos
```

### 2. **Instalar Dependencias**
```bash
npm install
```

### 3. **Configurar Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto llamado `sistemagestionalmuerzos`
3. Habilita **Firebase Authentication** (Email/Password)
4. Crea **Firestore Database**
5. Las credenciales ya están en `src/database/firebase.config.ts`

### 4. **Crear Colecciones en Firestore**

Crea 4 colecciones en Firestore Database:
- `usuarios`
- `menus`
- `pedidos`
- `reservas`

### 5. **Configurar Reglas de Seguridad**

En Firestore → **Reglas**, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth.uid == userId;
    }
    match /menus/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /reservas/{reservaId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 6. **Ejecutar en Desarrollo**
```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200`

---

## 📚 **Documentación Adicional**

- [FIRESTORE_INTEGRATION.md](./FIRESTORE_INTEGRATION.md) - Detalles de integración con Firestore
- [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) - Instrucciones de configuración de Firebase
- [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md) - Reglas de seguridad

---

## 🎨 **Características Principales**

### Autenticación
- ✅ Registro de nuevos usuarios
- ✅ Login con email/password
- ✅ Validación de contraseñas
- ✅ Recuperación de contraseña
- ✅ Persistencia de sesión

### Menú y Carrito
- ✅ Catálogo de comidas por categorías
- ✅ Búsqueda de items
- ✅ Filtros por categoría
- ✅ Carrito de compras
- ✅ Cálculo automático de totales

### Pedidos
- ✅ Crear pedidos desde carrito
- ✅ Ver historial de pedidos
- ✅ Rastrear estado en tiempo real
- ✅ Cancelar pedidos
- ✅ Agregar notas al pedido

### Reservas
- ✅ Crear reservas para eventos
- ✅ Seleccionar fecha y hora
- ✅ Especificar cantidad de personas
- ✅ Ver reservas confirmadas/pendientes
- ✅ Cancelar reservas

### Dashboard
- ✅ Estadísticas de almuerzos pendientes
- ✅ Ingresos del mes
- ✅ Pedidos entregados
- ✅ Reservas confirmadas

---

## 💻 **Requisitos del Sistema**

- Node.js 18+
- npm 9+
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para Firebase)

---

## 📝 **Notas Importantes**

- Todos los datos se almacenan en **Firestore** (sin mock data)
- Autenticación real con **Firebase Authentication**
- Los usuarios solo ven sus propios pedidos y reservas (protegido por reglas de Firestore)
- Las sesiones se persisten en el navegador
- La aplicación es **responsive** y funciona en móviles

---

## 🤝 **Contribuciones**

Para contribuir al proyecto:

1. Crea una rama (`git checkout -b feature/tu-feature`)
2. Commit tus cambios (`git commit -m 'Agregar feature'`)
3. Push a la rama (`git push origin feature/tu-feature`)
4. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto es propietario y fue desarrollado para fines académicos/comerciales.

---

## 📞 **Contacto**

Para preguntas o soporte, contacta a los integrantes del equipo.

---

**Última actualización:** Junio 2026