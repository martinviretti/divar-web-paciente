# Arquitectura funcional

## 1. Mapa de experiencia

### Sitio publico

- Inicio.
- Tratamientos.
- Profesionales.
- Como funciona el acceso.
- Primera consulta.
- Preguntas frecuentes.
- Contacto.

### Portal privado

- **Resumen:** panorama del paciente, proximo turno, progreso del plan y accesos rapidos.
- **Turnos:** reserva, confirmacion, detalle, reprogramacion, cancelacion e historial.
- **Mi salud:** plan de tratamiento, historial clinico, estudios, documentos y consentimientos.
- **Mensajes:** canal administrativo con el consultorio.
- **Pagos y presupuestos:** saldos, comprobantes, presupuestos y pagos.
- **Perfil y cobertura:** datos personales, cobertura, grupo familiar, preferencias y seguridad.

## 2. Regla contra la redundancia

Cada dato tiene un modulo propietario:

| Dato o accion | Modulo propietario | Como aparece fuera del modulo |
| --- | --- | --- |
| Proximo turno | Turnos | Resumen compacto con enlace a Turnos |
| Historial de turnos | Turnos | No se duplica |
| Plan de tratamiento | Mi salud | Indicador resumido en Inicio |
| Historia clinica | Mi salud | No se duplica |
| Estudios y documentos | Mi salud | Contador resumido en Inicio |
| Mensajes | Mensajes | Solo ultimo mensaje y contador en Inicio |
| Pagos y presupuestos | Pagos | Solo saldo resumido en Inicio |
| Cobertura y grupo familiar | Perfil | Resumen informativo en Inicio |

## 3. Flujo de alta de paciente

1. Recepcion valida identidad y correo del paciente.
2. El sistema crea la cuenta y envia una clave temporal DIVAR de un solo uso.
3. El paciente ingresa con correo y clave temporal.
4. El sistema obliga a crear una contrasena definitiva.
5. El paciente acepta terminos, privacidad y preferencias de notificacion.
6. La cuenta queda activa para web y app.

## 4. Flujo de reserva

1. Seleccionar paciente del grupo familiar.
2. Elegir motivo o tratamiento.
3. Elegir profesional o primera disponibilidad.
4. Elegir fecha, horario y modalidad.
5. Revisar y confirmar.
6. El backend bloquea el horario de manera atomica y devuelve el turno confirmado.

## 5. Web y app

La PWA incluida permite instalar la web como app. Una futura app nativa puede reutilizar las mismas APIs, reglas, usuarios y datos. La interfaz puede variar, pero la fuente de verdad debe ser unica.
