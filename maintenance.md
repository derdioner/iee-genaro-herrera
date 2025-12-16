# Guía de Mantenimiento - IEE GENARO HERRERA

¡Felicidades por tu nuevo sitio web! Esta guía te ayudará a mantenerlo actualizado sin depender de un asistente externo.

## 🚀 Flujo de Trabajo (Resumen)

Tu sitio está alojado en **Vercel** y conectado a **GitHub**. Esto significa que **cualquier cambio que subas a GitHub se publicará automáticamente en tu dominio**.

1.  **Editas** los archivos en tu computadora (VS Code).
2.  **Guardas** los cambios.
3.  **Sincronizas** con GitHub (Push).
4.  **Vercel** detecta el cambio y actualiza la web en segundos.

---

## 🛠️ Herramientas Necesarias

1.  **Visual Studio Code (VS Code)**: Tu editor de texto.
2.  **Git**: Para subir los cambios.

---

## 📝 Tareas Comunes

### 1. Cambiar una Noticia o Texto
1.  Abre la carpeta del proyecto en VS Code.
2.  Busca el archivo HTML correspondiente (ej. `index.html`).
3.  Usa `Ctrl + F` para buscar el texto que quieres cambiar.
4.  Edita el texto dentro de las etiquetas (ej. `<p>Nuevo texto aquí</p>`).
5.  Guarda el archivo (`Ctrl + S`).

### 2. Cambiar una Imagen
1.  Ten tu nueva imagen lista (formato `.jpg` o `.png`).
2.  Guárdala en la carpeta `images/` del proyecto.
3.  En el HTML, busca la etiqueta `<img>` y cambia el nombre en `src`:
    ```html
    <!-- Antes -->
    <img src="images/foto-vieja.jpg">
    
    <!-- Ahora -->
    <img src="images/foto-nueva.jpg">
    ```

### 3. Subir las notas de Conducta (Excel)
Esto no requiere código. Solo entra a tu página web:
1.  Ve al Login.
2.  Entra como "Personal / Docente".
3.  Ve a "Carga Masiva".
4.  Sube tu CSV/Excel.

---

## ☁️ Cómo Publicar tus Cambios (Deploy)

Una vez que hayas guardado tus cambios en VS Code, necesitas enviarlos a la nube.

### Opción A: Usando la Terminal de VS Code (Recomendada)
1.  Abre la terminal en VS Code (`Ctrl + ñ` o `Terminal > New Terminal`).
2.  Escribe estos 3 comandos (uno por uno):

    ```bash
    git add .
    ```
    *(Esto "prepara" todos los archivos modificados)*

    ```bash
    git commit -m "Descripción de lo que hiciste"
    ```
    *(Esto "guarda" una versión en tu historial. Cambia el mensaje entre comillas)*

    ```bash
    git push origin main
    ```
    *(Esto "envía" los cambios a GitHub)*

### Opción B: Usando el Menú de VS Code
1.  Ve al ícono de "Source Control" (el que tiene ramificaciones) en la barra izquierda.
2.  Escribe un mensaje en la casilla (ej. "Actualizar foto").
3.  Dale clic al botón **"Commit"** (o "Sync Changes").

---

## 🆘 Solución de Problemas

*   **No veo mis cambios en la web:** Vercel suele tardar 1-2 minutos. Si no aparece, prueba refrescar con `Ctrl + F5` para limpiar la caché.
*   **Error al subir (Git):** Asegúrate de tener internet. Si dice que hay conflictos, puede que necesites hacer `git pull` primero.

---

### ¡Tú tienes el control total! 
Todo el código es tuyo y está en tu cuenta de GitHub.
