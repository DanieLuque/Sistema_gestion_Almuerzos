# Sistema Gestión de Almuerzos - Frontend

Frontend moderno y responsivo para el Sistema de Gestión de Almuerzos, construido con **Angular 17**, **TailwindCSS** y **FontAwesome**.

## 🚀 Características

- ✨ Interfaz moderna y limpia con animaciones fluidas
- 📱 Completamente responsivo (Mobile-first)
- 🎨 Diseño profesional con Glassmorphism y efectos modernos
- 🎭 Animaciones avanzadas sin bibliotecas externas
- 🌐 Componentes standalone de Angular
- 📦 Estructura escalable y modular
- ♿ Accesibilidad mejorada (WCAG 2.1 AA)

## 🛠 Tecnologías

- **Angular 17** - Framework moderno
- **TailwindCSS** - Estilos con CDN
- **FontAwesome 6.4** - Iconografía
- **RxJS 7.8** - Manejo reactivo
- **TypeScript 5.2** - Tipado estricto

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x o yarn >= 3.x
- Angular CLI >= 17.x

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Sistema_gestion_Almuerzos

# Instalar dependencias
npm install

# Configurar Angular CLI (si aún no está instalado)
npm install -g @angular/cli@17
```

## 🏃 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# O con watch automático
npm run dev
```

Accede a `http://localhost:4200/` en tu navegador.

### Build para Producción

```bash
npm run build:prod
```

Los archivos compilados estarán en `dist/sistema-gestion-almuerzos/`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios singleton y guards
│   │   └── services/
│   ├── shared/               # Componentes reutilizables
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   └── footer/
│   │   └── animations/       # Triggers de animaciones
│   ├── features/             # Módulos de características
│   │   ├── dashboard/        # Issue #15
│   │   ├── menu/             # Issue #12
│   │   ├── reservas/         # Issue #13
│   │   ├── pedidos/          # Issue #14
│   │   └── auth/             # Issue #11
│   ├── app.component.ts      # Componente raíz
│   └── app.routes.ts         # Configuración de rutas
├── environments/             # Configuración de ambiente
├── styles.css                # Estilos globales
├── index.html                # HTML principal
└── main.ts                   # Entry point
```

## 🎯 Issues Implementados

### Issue #9: Diseñar Interfaz Principal ✅
- ✅ Layout base con navbar y footer
- ✅ Animaciones modernas de entrada
- ✅ Sistema de colores profesional
- ✅ Componentes base (Navbar, Footer)
- ✅ Estilos globales con TailwindCSS
- ✅ Animaciones reutilizables

## 🎨 Componentes Disponibles

### Navbar
- Navegación responsiva
- Menú móvil collapsible
- Animaciones de slide-down
- Iconos con FontAwesome

### Footer
- Secciones con enlaces
- Redes sociales
- Información de contacto
- Animación de slide-up

### Dashboard
- Grid de estadísticas
- Cards con hover effects
- Botones con animaciones
- Acciones rápidas

### Menú
- Grid de productos
- Filtros de categoría
- Ratings de productos
- Carrito de compras

## 🎬 Animaciones Implementadas

- `fadeIn` - Transición de opacidad
- `slideUp` - Deslizamiento hacia arriba
- `slideDown` - Deslizamiento hacia abajo
- `scaleIn` - Aumento de escala
- `bounceIn` - Efecto rebote
- `rotateIn` - Rotación de entrada
- `float` - Efecto flotante continuo
- `glow` - Efecto de brillo
- Hover effects avanzados
- Microinteracciones

## 🔧 Configuración

### TailwindCSS

El archivo `tailwind.config.js` contiene:
- Colores personalizados
- Animaciones extendidas
- Configuración de temas

### TypeScript

Paths configurados en `tsconfig.json`:
- `@app/*` - Componentes de la app
- `@core/*` - Servicios core
- `@shared/*` - Componentes compartidos
- `@features/*` - Módulos de características
- `@environments/*` - Configuración

## 📱 Responsive Design

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large**: 1280px+

## 🚀 Próximos Pasos

- [ ] Issue #10: Crear navbar y rutas
- [ ] Issue #11: Formulario de login y registro
- [ ] Issue #12: Vista completa de Menú
- [ ] Issue #13: Vista completa de Reservas
- [ ] Issue #14: Vista completa de Pedidos
- [ ] Issue #15: Dashboard y estadísticas
- [ ] Issue #16: Buscador y filtros avanzados

## 📝 Convenciones

### Nombres de Archivos
- Componentes: `component-name.component.ts`
- Servicios: `service-name.service.ts`
- Rutas: `component-name.routes.ts`

### Estructura de Componentes
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [...],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.css',
  animations: [...]
})
export class ComponentNameComponent {
  // Lógica del componente
}
```

## 🤝 Contribución

1. Crear rama desde `frontend`: `git checkout -b feature-issue-X`
2. Realizar cambios
3. Hacer commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature-issue-X`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Autores

- **Persona 2** - Frontend Developer

---

**Última actualización**: Junio 2026 | **Issue #9 Completado** ✅
