/**
 * Independent Top Navigation Manager
 * Maneja la barra superior de navegación de forma independiente
 */
class IndependentTopNavManager {
  constructor() {
    this.topNav = null;
    this.hamburgerBtn = null;
    this.backBtn = null;
    this.viewToggleBtn = null;
    this.navTitle = null;
    this.drawerMenu = null;
    this.drawerOverlay = null;
    this.isLiquorSubcategory = false;
    this.currentSubcategory = null;
    
    this.init();
  }
  
  init() {
    // Encontrar elementos DOM
    this.topNav = document.getElementById('top-nav');
    this.hamburgerBtn = document.getElementById('top-hamburger-btn');
    this.backBtn = document.getElementById('top-back-btn');
    this.viewToggleBtn = document.getElementById('top-view-toggle-btn');
    this.navTitle = document.getElementById('nav-title');
    this.drawerMenu = document.getElementById('drawer-menu');
    this.drawerOverlay = document.getElementById('drawer-overlay');
    
    if (!this.topNav) {
      console.error('Top navigation element not found');
      return;
    }
    
    // Mostrar la barra superior
    this.show();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Configurar el título inicial
    this.updateTitle('Coctelería');
    
    console.log('IndependentTopNavManager initialized successfully');
  }
  
  show() {
    if (this.topNav) {
      this.topNav.classList.add('show');
      document.body.classList.add('top-nav-visible');
    }
  }
  
  hide() {
    if (this.topNav) {
      this.topNav.classList.remove('show');
      document.body.classList.remove('top-nav-visible');
    }
  }
  
  setupEventListeners() {
    // Botón hamburguesa
    if (this.hamburgerBtn) {
      this.hamburgerBtn.addEventListener('click', () => {
        this.toggleDrawer();
      });
    }
    
    // Botón atrás
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        this.handleBackButton();
      });
    }
    
    // Botón de cambio de vista
    if (this.viewToggleBtn) {
      this.viewToggleBtn.addEventListener('click', () => {
        this.handleViewToggle();
      });
    }
    
    // Cerrar drawer al hacer click en overlay
    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener('click', () => {
        this.closeDrawer();
      });
    }
    
    // Escuchar eventos de contenido listo
    document.addEventListener('app-content-ready', (event) => {
      this.handleContentReady(event.detail);
    });
  }
  
  toggleDrawer() {
    if (this.drawerMenu && this.drawerOverlay) {
      const isOpen = this.drawerMenu.classList.contains('open');
      
      if (isOpen) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    }
  }
  
  openDrawer() {
    if (this.drawerMenu && this.drawerOverlay) {
      this.drawerMenu.classList.add('open');
      this.drawerOverlay.classList.add('active');
    }
  }
  
  closeDrawer() {
    if (this.drawerMenu && this.drawerOverlay) {
      this.drawerMenu.classList.remove('open');
      this.drawerOverlay.classList.remove('active');
    }
  }
  
  handleBackButton() {
    if (this.isLiquorSubcategory) {
      // Volver a la vista de categorías de licores
      this.setLiquorSubcategoryState(false);
      
      // Cargar contenido de licores
      if (window.AppInit && window.AppInit.loadContent) {
        window.AppInit.loadContent('licores');
      }
    }
  }
  
  handleViewToggle() {
    // Cambiar modo de vista
    if (window.ProductTable && window.ProductTable.toggleViewMode) {
      const newMode = window.ProductTable.toggleViewMode();
      this.updateViewToggleButton(newMode);
    }
  }
  
  updateTitle(title) {
    if (this.navTitle) {
      this.navTitle.textContent = title;
    }
  }
  
  setLiquorSubcategoryState(isSubcategory, subcategoryName = null) {
    this.isLiquorSubcategory = isSubcategory;
    this.currentSubcategory = subcategoryName;
    
    if (this.backBtn) {
      this.backBtn.style.display = isSubcategory ? 'flex' : 'none';
    }
    
    if (this.viewToggleBtn) {
      this.viewToggleBtn.style.display = isSubcategory ? 'flex' : 'none';
    }
    
    // Actualizar título
    if (isSubcategory && subcategoryName) {
      this.updateTitle(subcategoryName.charAt(0).toUpperCase() + subcategoryName.slice(1));
    } else {
      this.updateTitle('Licores');
    }
  }
  
  updateViewToggleButton(currentMode) {
    if (this.viewToggleBtn) {
      if (currentMode === 'grid') {
        this.viewToggleBtn.textContent = '📋';
        this.viewToggleBtn.setAttribute('aria-label', 'Cambiar a vista de tabla');
      } else {
        this.viewToggleBtn.textContent = '🔲';
        this.viewToggleBtn.setAttribute('aria-label', 'Cambiar a vista de cuadrícula');
      }
    }
  }
  
  handleContentReady(detail) {
    const { contentType } = detail;
    
    // Actualizar título según el tipo de contenido
    const titles = {
      'cocteleria': 'Coctelería',
      'refrescos': 'Refrescos',
      'licores': 'Licores',
      'cervezas': 'Cervezas',
      'pizzas': 'Pizzas',
      'alitas': 'Alitas',
      'sopas': 'Sopas',
      'ensaladas': 'Ensaladas',
      'carnes': 'Carnes',
      'cafe': 'Café'
    };
    
    const title = titles[contentType] || contentType;
    this.updateTitle(title);
    
    // Resetear estado de subcategoría si no es licores
    if (contentType !== 'licores' && !this.isLiquorSubcategory) {
      this.setLiquorSubcategoryState(false);
    }
  }
  
  // Método para forzar sincronización (compatibilidad)
  forceSync() {
    // Método de compatibilidad - no hace nada específico
    console.log('IndependentTopNavManager: forceSync called');
  }
}

// Hacer disponible globalmente
window.IndependentTopNavManager = IndependentTopNavManager;