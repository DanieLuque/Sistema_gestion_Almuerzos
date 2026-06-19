# Base de Datos - Sistema de Restaurantes

## Colección: Usuarios
- nombre (string)
- email (string)
- rol (admin | cliente)
- activo (boolean)
- fechaCreacion (timestamp)

## Colección: Restaurantes
- nombre
- direccion
- telefono

## Colección: Mesas
- numero
- capacidad
- estado
- restauranteId

## Colección: Reservas
- usuarioId
- mesaId
- fecha
- estado