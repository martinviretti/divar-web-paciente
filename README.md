# DIVAR Odontologia - Web institucional + Portal del paciente

Version 2.0.0-demo. Frontend funcional y PWA demostrativa, construido en HTML, CSS y JavaScript sin frameworks.

## Que incluye

El proyecto combina dos experiencias en una misma base visual y funcional:

1. **Sitio publico de DIVAR**
   - Presentacion institucional.
   - Tratamientos y profesionales.
   - Explicacion del acceso para pacientes.
   - Solicitud de primera consulta.
   - Preguntas frecuentes y contacto.

2. **Portal privado del paciente**
   - Resumen personal.
   - Turnos: reservar, ver detalle, reprogramar, cancelar e historial.
   - Mi salud: plan de tratamiento, historial clinico, estudios y documentos.
   - Mensajes con el consultorio.
   - Pagos y presupuestos.
   - Perfil, cobertura, grupo familiar y preferencias.
   - Notificaciones, urgencias y modo instalable como PWA.

## Criterio para evitar redundancia

- **Resumen** muestra unicamente el proximo turno y un acceso para gestionarlo.
- **Turnos** es la unica fuente de verdad para reservas, cambios, cancelaciones e historial.
- **Mi salud** concentra plan, historial y documentos.
- **Mensajes**, **Pagos** y **Perfil** contienen solo las funciones de su dominio.

No hay una pantalla separada para cada variante de turno ni datos repetidos en distintos modulos.

## Acceso de demostracion

Cuenta habitual:

- Correo: `paciente.demo@gmail.com`
- Contrasena DIVAR: `Divar2026!`

Primer acceso con clave temporal:

- Correo: `nuevo.paciente@gmail.com`
- Clave temporal DIVAR: `DIVAR-4821`

La clave de DIVAR es independiente de la contrasena de Gmail. El consultorio solo registra la direccion de correo; nunca debe pedir ni guardar la contrasena de Google.

## Como abrirlo

### Opcion rapida

Abrir `DIVAR_Web_Paciente_Standalone.html` en Chrome, Edge, Firefox o Safari. Todo esta incorporado en un solo archivo.

### Proyecto modular

Servir esta carpeta con un servidor HTTP local. Ejemplo:

```bash
python3 -m http.server 8080
```

Luego abrir `http://localhost:8080`.

El servidor es necesario para probar correctamente el service worker y la instalacion PWA.

## Persistencia de la demostracion

La version demo guarda datos en `localStorage` del navegador. Esto permite simular una sesion, turnos, mensajes y configuraciones sin servidor, pero no sincroniza datos entre dispositivos.

Para que web y app compartan la misma informacion en produccion, ambas deben conectarse al mismo backend y a la misma base de datos. Ver `docs/INTEGRACION_BACKEND.md`.

## Estructura principal

- `index.html`: estructura del sitio publico y portal.
- `styles.css`: sistema visual responsive.
- `app.js`: datos demo, navegacion y flujos funcionales.
- `manifest.webmanifest`: configuracion PWA.
- `sw.js`: cache basico para instalacion.
- `assets/`: logos, iconos, fondos, profesionales y tratamientos.
- `preview/`: capturas verificadas.
- `docs/`: arquitectura, seguridad e integracion.
- `DIVAR_Web_Paciente_Standalone.html`: version autocontenida.

## Estado del producto

El frontend esta preparado como prototipo navegable y base visual de integracion. Antes de publicarlo con pacientes reales se requiere backend, autenticacion segura, autorizacion por paciente, cifrado, auditoria, almacenamiento protegido de documentos, integracion con agenda e historia clinica, politicas legales y configuracion de datos reales.
