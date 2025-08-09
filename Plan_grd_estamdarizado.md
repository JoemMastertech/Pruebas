# Plan de Estandarización del Modo Grid (sin afectar el modo Tabla)

## Objetivo
Estandarizar visualmente **todas las categorías y subcategorías de productos** en la **vista grid**, manteniendo un diseño consistente, limpio y optimizado.  
Este plan **NO modifica** el modo **tabla** ni su CSS asociado.

---

## Alcance
- Solo afecta elementos dentro de contenedores `.product-grid` y `.category-grid`.
- No modifica estructura HTML existente.
- No altera ni añade reglas CSS específicas para el modo tabla (`.product-table`).

---

## Fundamentos
1. Mantener CSS actual como fallback.
2. Añadir mejoras de **modo grid** bajo una clase global `body.grid-enhanced`.
3. Utilizar **variables CSS** para centralizar tamaños y espacios.
4. Adaptar las proporciones y tipografía según el tipo de grid (productos estándar, bebidas, licores, categorías de licores).
5. Reducir y unificar reglas repetidas para optimizar peso y mantenimiento.

---

## Estructura de Tipos de Grid

| Tipo | Categorías / Contenido                                         | Clases/Selectores                   |
|------|----------------------------------------------------------------|--------------------------------------|
| 1    | Alitas, Pizzas, Sopas, Ensaladas, Carnes, Postres, Café         | `.product-grid:not(.grid-type-2):not(.grid-type-3):not(.grid-type-4)` |
| 2    | Refrescos, Cervezas                                             | `.product-grid.grid-type-2`          |
| 3    | Subcategorías de Licores (Whisky, Tequila, Ron, Vodka, etc.)    | `.product-card.liquor-card`          |
| 4    | Categorías de licores                                           | `.category-grid.grid-type-4`         |

**Nota:** La asignación `.grid-type-X` puede añadirse en JS que controla `toggleView()` si es necesario.

---

## Implementación CSS

```css
/* 1. Activación segura */
body.grid-enhanced .product-grid {
  grid-template-columns: repeat(auto-fit, minmax(var(--card-min, 260px), 1fr));
  gap: var(--grid-gap, clamp(12px, 2vw, 20px));
  padding: var(--grid-pad, clamp(12px, 2vw, 20px));
}

/* 2. Estructura base de las cards */
body.grid-enhanced .product-card {
  display: grid;
  grid-template-rows:
    var(--media-slot, auto)
    var(--name-slot, auto)
    var(--ing-slot,  auto)
    var(--price-slot, auto);
  row-gap: var(--slot-gap, clamp(6px, 1.2cqw, 12px));
}

/* 3. Ajustes por tipo */
body.grid-enhanced .product-grid.grid-type-2 .product-card {
  --ing-slot: 0px;
}
body.grid-enhanced .product-grid.grid-type-2 .product-ingredients {
  display: none;
}
body.grid-enhanced .product-card.liquor-card {
  --media-slot: minmax(clamp(140px, 32cqw, 220px), auto);
  --price-gap: clamp(4px, 1cqw, 8px);
}
body.grid-enhanced .product-card.liquor-card .product-prices {
  display: flex;
  flex-direction: column;
  gap: var(--price-gap);
}
body.grid-enhanced .category-grid.grid-type-4 .category-name {
  font-size: clamp(0.95rem, 1.8vw, 1.2rem);
}
```

---

## Tipografía Fluida
Aplicar escalas fluidas para nombres e ingredientes sin cortar texto:

```css
body.grid-enhanced .product-card .product-name {
  font-size: clamp(0.9rem, 2.2cqw, 1.05rem);
  line-height: 1.2;
}
body.grid-enhanced .product-card .product-ingredients {
  font-size: clamp(0.8rem, 1.9cqw, 0.95rem);
  line-height: 1.3;
}
```

---

## Espaciado y Ritmo Visual
Controlar desde variables:

```css
body.grid-enhanced .product-card {
  --slot-gap:   clamp(6px, 1.2cqw, 12px);
  --price-gap:  clamp(6px, 1.2cqw, 10px);
}
```

---

## Plan de Ejecución

1. **Preparación**
   - Añadir clase `grid-enhanced` al `<body>` al activar modo grid.
   - (Opcional) Añadir `.grid-type-X` desde JS según la categoría actual.

2. **Desarrollo**
   - Incluir nuevas reglas CSS al final de `main.css` bajo comentario `/* GRID ENHANCED */`.
   - Mantener reglas actuales como fallback.
   - No modificar reglas de `.product-table`.

3. **Pruebas**
   - Verificar en breakpoints: 360, 390, 414, 768, 1024, 1366, 1440, 1920.
   - Revisar productos con nombres largos, múltiples precios, imágenes/gifs/videos.

4. **Despliegue**
   - Activar en entorno de pruebas.
   - Confirmar que la vista tabla no cambia.
   - Una vez validado, activar por defecto.

---

## Bloque JS para Asignar `.grid-type-X` Automáticamente

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".product-grid, .category-grid");
  if (!grid) return;

  if (grid.classList.contains("category-grid")) {
    grid.classList.add("grid-type-4");
  } else {
    const firstCard = grid.querySelector(".product-card");
    if (firstCard?.classList.contains("liquor-card")) {
      grid.classList.add("grid-type-3");
    } else if (["Refrescos", "Cervezas"].some(cat => grid.innerText.includes(cat))) {
      grid.classList.add("grid-type-2");
    } else {
      grid.classList.add("grid-type-1");
    }
  }
});
```

---

## Beneficios Esperados
- Código CSS más limpio y compacto.
- Reducción de duplicación de estilos por categoría.
- Diseño más consistente y armónico en modo grid.
- Facilidad para mantener y escalar a futuro.
