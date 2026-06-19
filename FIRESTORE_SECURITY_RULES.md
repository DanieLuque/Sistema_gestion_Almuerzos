# 🔐 CONFIGURAR REGLAS DE SEGURIDAD FIRESTORE

## PROBLEMA
Error: `Missing or insufficient permissions` al registrarse

## SOLUCIÓN
Necesitas configurar las reglas de seguridad en Firebase Console.

---

## PASO 1: IR A FIREBASE CONSOLE

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona proyecto: **sistemagestionalmuerzos**
3. Abre **Firestore Database** → **Reglas**

---

## PASO 2: REEMPLAZAR LAS REGLAS

Borra TODO lo que haya y pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios - permite crear durante registro, leer/escribir propio documento
    match /usuarios/{userId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth.uid == userId;
    }
    
    // Menús - lectura pública, solo admin puede escribir
    match /menus/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Pedidos - solo propietario puede acceder
    match /pedidos/{pedidoId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Reservas - solo propietario puede acceder
    match /reservas/{reservaId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## PASO 3: PUBLICAR LAS REGLAS

1. Click en botón **"Publicar"** (esquina superior derecha)
2. Confirma en el diálogo

---

## PASO 4: PROBAR EN LA APP

Ahora deberías poder:
1. ✅ Registrarte con nuevo usuario
2. ✅ Ver el documento en colección `usuarios`
3. ✅ Crear pedidos
4. ✅ Crear reservas

---

## 🔍 EXPLICACIÓN DE LAS REGLAS

| Colección | Quién puede leer | Quién puede escribir | Por qué |
|-----------|-----------------|-------------------|--------|
| **usuarios** | Propietario | Propietario + crear nuevo | Privacy del usuario |
| **menus** | Todos | Solo admin | Items disponibles publicamente |
| **pedidos** | Propietario | Propietario | Solo ves tus pedidos |
| **reservas** | Propietario | Propietario | Solo ves tus reservas |

---

## ⚠️ IMPORTANTE

Estas son reglas **BÁSICAS DE DESARROLLO**. Para producción, considera:
- Validación de datos (longitud de campos, tipos)
- Rate limiting (evitar spam)
- Backup automático
- Encriptación de datos sensibles

---

## ✅ VERIFICACIÓN

Después de publicar, abre la consola del navegador (F12) e intenta registrarte.
- Si ves error aún → Verifica que pegaste las reglas correctamente
- Si funciona → Deberías ver nuevo documento en `usuarios` → Firestore Console

---

**Pasos después de configurar reglas:**
1. Regresa a la app (localhost:4200)
2. Haz click en "Registrarse"
3. Completa el formulario
4. Si dice "Registrado exitosamente" ✅ Funcionó!
5. Si sigue dando error → Verifica las reglas nuevamente
