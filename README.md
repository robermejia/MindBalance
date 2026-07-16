# ⚡ MindBalance

**MindBalance** es una aplicación web premium de entrenamiento cognitivo y bienestar emocional basada en evidencia, inspirada en la **Terapia Cognitivo-Conductual (TCC)**. Ayuda a los usuarios a registrar sus pensamientos automáticos, practicar la respiración consciente y entrenar su atención de forma estructurada.

🚀 **Despliegue en Producción:** [https://mindbalance-8dl9.onrender.com/](https://mindbalance-8dl9.onrender.com/)

---

## 📸 Vista de la Aplicación

![MindBalance Screenshot](https://img.lightshot.app/_uWDILvcSx20wem4udPqjQ.png)

---

## ✨ Características Principales

*   **Panel de Control (Dashboard):** Visualización instantánea del progreso semanal, estado de ánimo y objetivos personales.
*   **Registro TCC (Diario de Pensamientos):** Formulario clínico estructurado para reestructuración cognitiva (registro de pensamientos automáticos, emociones, evidencias a favor/en contra y pensamientos alternativos).
*   **Entrenamiento de la Atención:** Ejercicio dinámico para registrar observaciones de interacciones sociales y gestos amigables en el día a día.
*   **Ejercicios de Respiración:** Sesión guiada de respiración consciente con cronómetro visual y registro de notas de bienestar.
*   **Estadísticas Detalladas:** Gráficos avanzados (progreso de ansiedad, emociones dominantes y distribución de atención) impulsados por Chart.js.
*   **Seguridad con Firebase:** Autenticación de usuarios segura (correo/contraseña y Google Sign-In) y almacenamiento en la nube en tiempo real (Firestore).
*   **Portabilidad de Datos:** Exportación e importación completa del historial de datos en formato JSON en un solo clic.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React 19 + TypeScript + Vite + Vanilla CSS
*   **Gráficos:** Chart.js + React-Chartjs-2
*   **Iconografía:** Lucide React
*   **Animaciones:** Framer Motion
*   **Base de Datos y Auth:** Google Firebase (Authentication & Firestore)

---

## 🚀 Instalación y Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/robermejia/MindBalance.git
    cd MindBalance
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Exponer en red local (opcional):**
    El script de desarrollo ya cuenta con `--host` para que puedas abrirlo en tu celular ingresando la IP local provista por Vite.

---

## 🔒 Seguridad en Producción

El proyecto cuenta con las credenciales de Firebase configuradas de forma segura. El acceso local simulado ha sido removido por completo en favor de una autenticación estricta en la nube administrada por los servidores de Google.
