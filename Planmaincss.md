# 📋 Plan Técnico para Optimización Responsive de `main.css`

## 🎯 Objetivo General

Simplificar, optimizar y blindar el archivo `main.css` para que sea único, robusto, mantenible y adaptable a móviles, tablets y ordenadores sin perder la visualización ni las funciones actuales. Todo debe residir en un solo archivo CSS (`main.css`) sin depender de otros archivos.

Este plan debe ser seguido sin ambigüedades para evitar desviaciones durante la implementación.

---

## 📁 Estructura Interna Recomendada de `main.css`

Organiza `main.css` en bloques bien delimitados y documentados con comentarios. Ejemplo de orden:

```css
/* ===================== RESET & ROOT ===================== */
/* Reset básico + variables globales */

/* ===================== TIPOGRAFÍA ===================== */
/* Fuentes base y ajustes responsive de escalado */

/* ===================== LAYOUT GENERAL ===================== */
/* Contenedores principales, grillas, columnas */

/* ===================== COMPONENTES ===================== */
/* Botones, inputs, cards, animaciones */

/* ===================== SISTEMA DE ÓRDENES ===================== */
/* Sección de visualización de órdenes */

/* ===================== BARRA SUPERIOR GLOBAL ===================== */
/* Navegación unificada en todas las resoluciones (menú, atrás, vista) */

/* ===================== MEDIA QUERIES ===================== */
/* Ajustes por orientación y resolución */
```

---

## 🔧 Variables Globales con `:root`

Al inicio del archivo, declara las variables CSS globales dentro de `:root`:

```css
:root {
  --color-bg: #000;
  --color-primary: #00ffff;
  --color-text: #fff;
  --font-size-base: clamp(14px, 2vw, 18px);
  --spacing-base: 1rem;
  --max-width: 1440px;

  --mobile-sidebar-width: 140px;
  --mobile-padding: 8px;
  --mobile-gap: 8px;
  --mobile-font-base: 0.8rem;
  --mobile-font-small: 0.7rem;
  --mobile-font-tiny: 0.6rem;
}
```

---

## 📌 Integración de barra superior global (`#top-nav`)

### HTML
```html
<nav id="top-nav" aria-label="Barra de navegación principal"></nav>
```

### CSS (para todas las resoluciones, adaptado con media queries)
```css
#top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--color-bg, #000);
  border-bottom: 1px solid var(--color-primary, cyan);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  z-index: 1000;
  transform: translateY(-100%);
  animation: slideDownNav 300ms ease-in-out forwards;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

#top-nav button {
  background: none;
  border: none;
  color: var(--color-primary, cyan);
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

#top-nav button:active {
  transform: scale(0.95);
}

@keyframes slideDownNav {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
```

### JS
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('top-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const backBtn = document.querySelector('.back-button');
  const viewToggleBtn = document.getElementById('view-toggle-btn');

  if (nav && hamburgerBtn && backBtn && viewToggleBtn) {
    nav.appendChild(backBtn);
    nav.appendChild(viewToggleBtn);
    nav.appendChild(hamburgerBtn);

    nav.style.display = 'flex';

    hamburgerBtn.setAttribute('aria-label', 'Abrir menú lateral');
    backBtn.setAttribute('aria-label', 'Volver');
    viewToggleBtn.setAttribute('aria-label', 'Cambiar vista');

    hamburgerBtn.addEventListener('click', openDrawer);
    backBtn.addEventListener('click', goBack);
    viewToggleBtn.addEventListener('click', toggleView);
  }
});
```

---

## 🧩 Prompt para implementación estructural completa (Trae)

```markdown
Analiza el contenido actual del frontend (HTML, CSS, JS) y refactoriza todo el sistema visual para que sea limpio, responsivo y mantenible en un único archivo CSS (main.css).

### Objetivo:
Implementar una arquitectura CSS modular dentro de un solo archivo, que soporte fácilmente:
- Móviles (portrait & landscape)
- Tablets
- Escritorio

### Requisitos:
1. Reorganiza el CSS en secciones bien documentadas: reset, root, layout, componentes, sistema de órdenes, barra superior global y media queries.
2. Declara variables globales con `:root` para fuentes, colores, espaciado y breakpoints.
3. Define todos los ajustes responsive dentro de `@media` sin archivos extra.
4. Asegura el comportamiento fijo de:
   - La barra superior global con tres botones integrados.
   - El panel de órdenes en móvil (inferior) y escritorio (derecho).
5. Reutiliza lógica JS ya existente sin duplicar funciones.
6. Elimina reglas duplicadas o innecesarias.
7. No modificar el diseño actual ni su funcionalidad.
8. No generar nuevos archivos.
9. El resultado debe ser un único `main.css`, limpio, robusto y autoexplicativo.
```

Este prompt puede ser usado directamente para regenerar todo el frontend manteniendo la funcionalidad, pero preparándolo para evolucionar sin complicaciones.
