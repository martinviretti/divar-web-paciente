# Integracion backend para web y app

## Objetivo

La web, la PWA y una futura app movil deben consumir las mismas APIs. Asi un turno reservado desde el celular aparece inmediatamente en la web y en la agenda del consultorio.

## Servicios sugeridos

- Autenticacion y sesiones.
- Pacientes y grupos familiares.
- Profesionales, especialidades y sedes.
- Agenda, disponibilidad y turnos.
- Planes de tratamiento.
- Historia clinica y eventos.
- Estudios, documentos y consentimientos.
- Mensajes y notificaciones.
- Presupuestos, pagos y comprobantes.
- Auditoria y administracion.

## Entidades basicas

- `users`
- `patients`
- `family_links`
- `professionals`
- `locations`
- `treatments`
- `availability_slots`
- `appointments`
- `treatment_plans`
- `treatment_plan_steps`
- `clinical_events`
- `documents`
- `conversations`
- `messages`
- `budgets`
- `payments`
- `notifications`
- `audit_events`

## Endpoints orientativos

```text
POST   /auth/activate
POST   /auth/login
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /me
GET    /patients
GET    /appointments
POST   /appointments
PATCH  /appointments/{id}/reschedule
PATCH  /appointments/{id}/cancel
GET    /availability
GET    /treatment-plans
GET    /clinical-history
GET    /documents
POST   /documents
GET    /conversations
POST   /conversations/{id}/messages
GET    /budgets
GET    /payments
POST   /payments/checkout
```

## Reglas importantes

- La disponibilidad debe validarse nuevamente al confirmar.
- La reserva debe ser atomica para impedir doble asignacion.
- El frontend nunca decide permisos; el servidor los valida.
- Los documentos deben almacenarse fuera de la base de datos, con acceso privado.
- Los datos clinicos deben versionarse o conservar trazabilidad de cambios.
- Los identificadores internos no deben permitir acceder a datos de otro paciente.

## Adaptacion del frontend incluido

En `app.js`, reemplazar el repositorio local basado en `localStorage` por funciones `fetch` o por un cliente API. Mantener la capa de render y los flujos, pero obtener el estado desde el servidor.
