# Análisis CSS para Preservación del Estado Visual Actual

## Resumen Ejecutivo
Este documento mapea los valores CSS críticos que deben preservarse para mantener la visualización actual de la página durante la consolidación del código fragmentado.

## Estado Visual Actual Documentado

### Viewport Desktop (1200px)
- **Media Query Activa**: `(min-width: 1200px)`
- **Archivos CSS Cargados**: `_variables-unified.css` → `main.css` → `top-navigation.css` → `mobile.css` (inactivo) → `tablet.css` (inactivo)

### Grid Principal (.product-grid)
**Valores Computados Críticos:**
```css
.product-grid {
  display: grid;
  grid-template-columns: 217.547px 217.562px 217.562px; /* 3 columnas */
  gap: 25px;
  padding: 25px;
  width: 752.672px;
  max-width: 1400px;
  margin: 0px 19.8125px;
}
```

### Tarjetas de Producto (.product-card)
**Valores Computados Críticos:**
```css
.product-card {
  width: ~217.5px; /* Calculado automáticamente por grid */
  height: 414.688px;
  padding: 20px;
  margin: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  box-shadow: rgba(0, 247, 255, 0.25) 0px 0px 10px 0px;
}
```

### Nombres de Producto (.product-name)
**Valores Computados Críticos:**
```css
.product-name {
  font-size: 15.6px;
  font-weight: 600;
  line-height: normal;
  height: 29.5156px;
  color: rgb(255, 255, 255);
  text-align: center;
}
```

## Variables CSS Activas

### Variables Unificadas (_variables-unified.css)
```css
:root {
  --gap: 16px;
  --padding: calc(16px * 1.2); /* = 19.2px */
  --grid-columns: 4;
  --grid-columns-desktop: 4;
  --grid-columns-tablet: 3;
  --grid-columns-mobile: 2;
  --card-radius: 12px;
  --card-padding: 16px;
}
```

## Mapeo de Interacciones entre Archivos

### 1. _variables-unified.css (Base)
- **Función**: Define variables CSS unificadas para todos los breakpoints
- **Valores Críticos**:
  - `--gap: 16px` (pero se aplica 25px en desktop)
  - `--padding: calc(16px * 1.2)` (pero se aplica 25px en desktop)
  - `--grid-columns-desktop: 4` (pero se aplica 3 columnas)

### 2. main.css (Reglas Principales)
- **Función**: Contiene las reglas fragmentadas que sobrescriben las variables
- **Reglas Críticas Aplicadas**:
  ```css
  /* Desktop: min-width: 1200px */
  .product-grid {
    grid-template-columns: repeat(3, 1fr); /* Sobrescribe --grid-columns */
    gap: 25px; /* Sobrescribe --gap */
    padding: 25px; /* Sobrescribe --padding */
  }
  ```

### 3. mobile.css (Inactivo en Desktop)
- **Función**: Reglas para móviles (max-width: 767px)
- **Estado**: No se aplica en viewport 1200px

### 4. tablet.css (Inactivo en Desktop)
- **Función**: Reglas para tablets (768px - 1199px)
- **Estado**: No se aplica en viewport 1200px

## Análisis de Cascada CSS

### Orden de Carga y Prioridad
1. `_variables-unified.css` - Define variables base
2. `main.css` - **SOBRESCRIBE** variables con valores específicos
3. `top-navigation.css` - Navegación (no afecta grid)
4. `mobile.css` - Inactivo (media query no coincide)
5. `tablet.css` - Inactivo (media query no coincide)

### Reglas que Realmente se Aplican

**✅ APLICADAS (Críticas para preservar):**
- `main.css` líneas ~460-480: `.product-grid` con 3 columnas, gap 25px, padding 25px
- `main.css` líneas ~1845: `.product-name` con font-size específico
- `main.css`: `.product-card` con padding 20px, background rgba(0,0,0,0.7)

**❌ SOBRESCRITAS (No se aplican):**
- `_variables-unified.css`: `--grid-columns: 4` (se aplica 3)
- `_variables-unified.css`: `--gap: 16px` (se aplica 25px)
- `_variables-unified.css`: `--padding: calc(16px * 1.2)` (se aplica 25px)

## Reglas Duplicadas Identificadas

### .product-grid (Fragmentado en main.css)
- **Línea ~460**: Desktop base (3 columnas)
- **Línea ~1890**: Responsive ajustes
- **Línea ~2000**: Mobile específico
- **Línea ~2120**: Landscape móvil
- **Línea ~2275**: Tablet responsive
- **Línea ~2360**: Desktop grande

### .product-name (Duplicado)
- **Línea ~1845**: font-size con clamp()
- **Línea ~2003**: font-size específico
- **Resultado**: Se aplica 15.6px (último en cascada)

## Valores Críticos que DEBEN Preservarse

### Para Desktop (1200px+)
```css
.product-grid {
  grid-template-columns: repeat(3, 1fr); /* NO 4 columnas */
  gap: 25px; /* NO 16px */
  padding: 25px; /* NO 19.2px */
  max-width: 1400px;
}

.product-card {
  padding: 20px; /* NO 16px */
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px; /* NO 12px */
  box-shadow: rgba(0, 247, 255, 0.25) 0px 0px 10px 0px;
}

.product-name {
  font-size: 15.6px;
  font-weight: 600;
  height: 29.5156px;
}
```

## Recomendaciones para Consolidación

### 1. Actualizar Variables Unificadas
```css
/* _variables-unified.css - Desktop */
@media (min-width: 1200px) {
  :root {
    --grid-columns-desktop: 3; /* Cambiar de 4 a 3 */
    --gap: 25px; /* Cambiar de 16px a 25px */
    --padding: 25px; /* Cambiar de calc(16px * 1.2) a 25px */
    --card-padding: 20px; /* Cambiar de 16px a 20px */
    --card-radius: 10px; /* Cambiar de 12px a 10px */
  }
}
```

### 2. Eliminar Reglas Duplicadas en main.css
- Consolidar todas las definiciones de `.product-grid` en una sola sección
- Eliminar duplicados de `.product-name`
- Usar variables CSS en lugar de valores hardcodeados

### 3. Plan de Migración Segura
1. **Fase 1**: Actualizar variables en `_variables-unified.css` para que coincidan con valores actuales
2. **Fase 2**: Reemplazar valores hardcodeados en `main.css` con variables CSS
3. **Fase 3**: Eliminar reglas duplicadas manteniendo solo la más específica
4. **Fase 4**: Verificar que el resultado visual sea idéntico

## Conclusión
La fragmentación actual en `main.css` está sobrescribiendo las variables unificadas. Para consolidar sin romper la visualización, primero debemos actualizar las variables para que reflejen los valores realmente aplicados, luego eliminar las reglas duplicadas.