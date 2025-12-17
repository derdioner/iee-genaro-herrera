# Cómo obtener tu Access Token de Facebook

Para que la sección de noticias funcione automáticamente, necesitas una "llave" de Facebook llamada **Access Token**. Sigue estos pasos:

## Paso 1: Crear una App en Meta for Developers

1. Ve a [Meta for Developers](https://developers.facebook.com/) e inicia sesión con tu cuenta de Facebook.
2. Haz clic en **"Mis Apps"** (o "My Apps") en la esquina superior derecha.
3. Haz clic en el botón verde **"Crear App"** (Create App).
4. Selecciona **"Otro"** (Other) > **Siguiente**.
5. Selecciona el tipo de app: **"Negocios"** (Business) > **Siguiente**.
6. Escribe un nombre (ej: "Web Colegio GH") y pon tu correo > **Crear App**.

## Paso 2: Obtener el Token (Llave)

1. Una vez creada la app, ve al menú superior **"Herramientas"** (Tools) > **"Explorador de la API Graph"** (Graph API Explorer).
2. En la columna derecha, asegúrate de que en "Meta App" esté seleccionada la app que acabas de crear.
3. En "Usuario o Página" (User or Page), selecciona **"Obtener token de acceso a la página"** (Get Page Access Token).
   - Te pedirá permiso para conectar con tu cuenta. Acepta.
   - Selecciona la página del colegio ("IEE Genaro Herrera").
4. **IMPORTANTE - Permisos:**
   - En la sección "Permisos" (Permissions), busca y agrega estos dos:
     - `pages_read_engagement`
     - `pages_read_user_content`
   - Haz clic en **"Generate Access Token"** de nuevo para actualizar los permisos.

## Paso 3: Copiar y Pegar

1. En el campo superior donde dice "Access Token", verás un código muy largo con letras y números.
2. Dale clic al botón de copiar o selecciónalo todo y cópialo.
3. Ve a tu archivo `facebook-news.js` en la línea 8 y reemplaza:
   ```javascript
   const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';
   ```
   por:
   ```javascript
   const ACCESS_TOKEN = 'PEGAR_TU_CODIGO_AQUI';
   ```
4. Guarda el archivo y sube los cambios.

---

### ⚠️ Nota sobre la duración

El token que obtienes así suele durar **l poco tiempo (horas o días)**. Para una solución permanente, se necesitan pasos técnicos más avanzados ("Token de larga duración" o verificar tu negocio en Facebook).

Por ahora, usa este método para verificar que el sistema funciona. Si el token caduca en el futuro, solo tendrás que generar uno nuevo y actualizar el archivo.
