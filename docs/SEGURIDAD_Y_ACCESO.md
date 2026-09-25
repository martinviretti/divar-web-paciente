# Seguridad y acceso

## Principio central

DIVAR puede solicitar una direccion de correo, por ejemplo Gmail, pero nunca la contrasena de Google. La cuenta del portal debe usar una contrasena propia de DIVAR o un inicio con Google mediante OAuth oficial.

## Flujo recomendado con contrasena temporal

1. Recepcion registra el correo verificado.
2. El servidor genera una clave aleatoria de un solo uso.
3. La clave vence en un plazo corto y queda almacenada como hash, no en texto plano.
4. En el primer acceso se exige una nueva contrasena.
5. Se invalidan todas las claves temporales anteriores.
6. Se registra el evento en auditoria.

## Alternativa con Google

Implementar OAuth 2.0 / OpenID Connect. El paciente se autentica en una pagina oficial de Google y DIVAR recibe un identificador y datos autorizados. DIVAR no ve ni almacena la contrasena de Google.

## Controles minimos para produccion

- HTTPS obligatorio.
- Hash de contrasenas con Argon2id o bcrypt y parametros actualizados.
- Verificacion de correo y recuperacion mediante enlaces de un solo uso.
- Segundo factor opcional o requerido para operaciones sensibles.
- Sesiones cortas, renovacion segura y cierre remoto.
- Autorizacion por paciente y grupo familiar en cada solicitud.
- Cifrado de datos sensibles en transito y reposo.
- Almacenamiento privado de estudios y documentos con URLs temporales.
- Registro de accesos, cambios, descargas y acciones del personal.
- Proteccion frente a fuerza bruta, enumeracion de cuentas, CSRF, XSS e inyecciones.
- Consentimiento explicito para datos de salud y comunicaciones.
- Backups, recuperacion, retencion y eliminacion definidas.
- Revision legal y de privacidad aplicable a Argentina antes de operar con datos reales.

## Limite de esta demo

El HTML usa `localStorage` y credenciales visibles para demostrar la experiencia. No debe publicarse como sistema clinico real sin reemplazar esa capa por autenticacion y almacenamiento de servidor.
