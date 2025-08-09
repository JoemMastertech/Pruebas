/**
 * BARRA SUPERIOR INDEPENDIENTE - SISTEMA SIMPLIFICADO
 * Sistema de navegación superior completamente independiente sin sincronización
 * Versión 2.0 - Sin MutationObserver, sin funciones sync, lógica propia
 */

class IndependentTopNavManager {
  constructor() {
    this.isInitialized = false;
    this.state = {
      viewMode: 'table', // 'table' o 'grid'
      menuOpen: false,
      backButtonVisible: false
    };
    
    // Referencias a elementos DOM
    this.elements = {
      topNav: null,
      hamburgerBtn: null,
      backBtn: null,
      viewToggleBtn: null,
      navTitle: null,
      drawerMenu: null,
      drawerOverlay: null
    };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.findElements();
    this.loadState();
    this.syncInitialMenuState(); // Sincronizar estado inicial del menú
    this.setupEventListeners();
    this.setupContentReadyListener();
    this.updateUI();
    this.isInitialized = true;
    console.log('IndependentTopNavManager: Initialized successfully');
  }

  syncInitialMenuState() {
    // Forzar que el menú esté cerrado al inicializar
    if (this.elements.drawerMenu && this.elements.drawerOverlay) {
      // Verificar el estado visual actual del DOM
      const isVisuallyOpen = this.elements.drawerMenu.classList.contains('open');
      
      // Remover clases de apertura si existen
      this.elements.drawerMenu.classList.remove('open');
      this.elements.drawerOverlay.classList.remove('active');
      
      // Asegurar que el estado interno sea consistente con el estado visual
      this.state.menuOpen = false;
      
      console.log('IndependentTopNavManager: Menu state synchronized - was visually open:', isVisuallyOpen, 'now closed');
    }
  }

  findElements() {
    // Encontrar elementos de la barra superior
    this.elements.topNav = document.getElementById('top-nav');
    this.elements.hamburgerBtn = document.getElementById('top-hamburger-btn');
    this.elements.backBtn = document.getElementById('top-back-btn');
    this.elements.viewToggleBtn = document.getElementById('top-view-toggle-btn');
    this.elements.navTitle = document.getElementById('nav-title');
    this.elements.drawerMenu = document.getElementById('drawer-menu');
    this.elements.drawerOverlay = document.getElementById('drawer-overlay');
    
    console.log('IndependentTopNavManager: Elements found:', {
      topNav: !!this.elements.topNav,
      hamburger: !!this.elements.hamburgerBtn,
      back: !!this.elements.backBtn,
      viewToggle: !!this.elements.viewToggleBtn,
      title: !!this.elements.navTitle,
      drawer: !!this.elements.drawerMenu,
      overlay: !!this.elements.drawerOverlay
    });
  }

  loadState() {
    // Cargar estado desde localStorage
    try {
      const savedViewMode = localStorage.getItem('topNav_viewMode');
      if (savedViewMode && ['table', 'grid'].includes(savedViewMode)) {
        this.state.viewMode = savedViewMode;
        
        // Activar grid-enhanced automáticamente si el modo es grid
        if (savedViewMode === 'grid') {
          document.body.classList.add('grid-enhanced');
        } else {
          document.body.classList.remove('grid-enhanced');
        }
      }
      
      // El menú siempre debe iniciar cerrado
      this.state.menuOpen = false;
      
      // Determinar si el botón de retroceso debe estar visible
      // Basado en la URL actual o estado de la aplicación
      this.state.backButtonVisible = this.shouldShowBackButton();
      
      console.log('IndependentTopNavManager: State loaded:', this.state);
    } catch (error) {
      console.warn('IndependentTopNavManager: Error loading state:', error);
    }
  }

  saveState() {
    // Guardar estado en localStorage
    try {
      localStorage.setItem('topNav_viewMode', this.state.viewMode);
      console.log('IndependentTopNavManager: State saved:', this.state);
    } catch (error) {
      console.warn('IndependentTopNavManager: Error saving state:', error);
    }
  }

  shouldShowBackButton() {
    // Lógica independiente para determinar si mostrar el botón de retroceso
    // Basado en el estado de la aplicación, no en elementos DOM
    const currentScreen = document.querySelector('.screen:not(.screen-hidden)');
    const isMainContent = currentScreen && currentScreen.classList.contains('main-content-screen');
    const hasContent = document.querySelector('#content-container')?.children.length > 0;
    
    return isMainContent && hasContent;
  }

  setupEventListeners() {
    // Event listener para botón hamburguesa
    if (this.elements.hamburgerBtn) {
      this.elements.hamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    // Event listener para botón de retroceso
    if (this.elements.backBtn) {
      this.elements.backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBackClick();
      });
    }

    // Event listener para botón de cambio de vista
    if (this.elements.viewToggleBtn) {
      this.elements.viewToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleViewMode();
      });
    }

    // Event listener para overlay del menú
    if (this.elements.drawerOverlay) {
      this.elements.drawerOverlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Escuchar cambios en el contenido para actualizar el botón de retroceso
    document.addEventListener('app-content-changed', () => {
      this.updateBackButtonVisibility();
      // Cerrar el menú automáticamente cuando cambia el contenido
      if (this.state.menuOpen) {
        this.closeMenu();
        console.log('IndependentTopNavManager: Menu closed due to content change');
      }
    });

    // Add scroll behavior for hamburger button in mobile portrait
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only apply scroll behavior on mobile portrait
      if (window.innerWidth <= 480 && window.innerHeight > window.innerWidth && this.elements.hamburgerBtn) {
        if (currentScroll > lastScrollTop && currentScroll > 50) {
          // Scrolling down - add scrolled class
          this.elements.hamburgerBtn.classList.add('scrolled');
        } else {
          // Scrolling up - remove scrolled class
          this.elements.hamburgerBtn.classList.remove('scrolled');
        }
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }

  setupContentReadyListener() {
    // Escuchar cuando el contenido esté listo
    document.addEventListener('app-content-ready', () => {
      this.showTopNav();
      this.updateBackButtonVisibility();
    });
  }

  // === MÉTODOS DE ACCIÓN ===

  toggleMenu() {
    // Verificar sincronización entre estado interno y visual antes del toggle
    if (this.elements.drawerMenu) {
      const isVisuallyOpen = this.elements.drawerMenu.classList.contains('open');
      
      // Si hay desincronización, corregir el estado interno
      if (this.state.menuOpen !== isVisuallyOpen) {
        console.log('IndependentTopNavManager: State desync detected - internal:', this.state.menuOpen, 'visual:', isVisuallyOpen);
        this.state.menuOpen = isVisuallyOpen;
      }
    }
    
    this.state.menuOpen = !this.state.menuOpen;
    this.updateMenuUI();
    console.log('IndependentTopNavManager: Menu toggled:', this.state.menuOpen);
  }

  closeMenu() {
    this.state.menuOpen = false;
    this.updateMenuUI();
    console.log('IndependentTopNavManager: Menu closed');
  }

  handleBackClick() {
    // Navegación independiente - usar historial del navegador o lógica personalizada
    const container = document.querySelector('.content-wrapper') || document.querySelector('#content-container');
    
    if (container && window.ProductRenderer && window.ProductRenderer.renderLicores) {
      // Usar la funcionalidad existente del ProductRenderer
      window.ProductRenderer.renderLicores(container);
      console.log('IndependentTopNavManager: Back navigation executed');
    } else {
      // Fallback: usar historial del navegador
      if (window.history.length > 1) {
        window.history.back();
      }
      console.log('IndependentTopNavManager: Browser back navigation executed');
    }
    
    // Actualizar visibilidad del botón después de la navegación
    setTimeout(() => {
      this.updateBackButtonVisibility();
    }, 100);
  }

  toggleViewMode() {
    // Cambiar modo de vista independientemente
    this.state.viewMode = this.state.viewMode === 'table' ? 'grid' : 'table';
    this.saveState();
    this.updateViewToggleUI();
    
    // Activar/desactivar grid-enhanced según el modo
    if (this.state.viewMode === 'grid') {
      document.body.classList.add('grid-enhanced');
    } else {
      document.body.classList.remove('grid-enhanced');
    }
    
    // Aplicar el cambio de vista
    if (window.ProductRenderer && window.ProductRenderer.setViewMode) {
      window.ProductRenderer.setViewMode(this.state.viewMode);
    } else if (window.ProductRenderer && window.ProductRenderer.toggleViewMode) {
      window.ProductRenderer.toggleViewMode();
    }
    
    // Refrescar la vista actual
    const container = document.querySelector('.content-wrapper') || document.querySelector('#content-container');
    if (container && window.ProductRenderer && window.ProductRenderer.refreshCurrentView) {
      window.ProductRenderer.refreshCurrentView(container);
    }
    
    console.log('IndependentTopNavManager: View mode changed to:', this.state.viewMode);
  }

  // === MÉTODOS DE ACTUALIZACIÓN DE UI ===

  updateUI() {
    this.updateMenuUI();
    this.updateBackButtonVisibility();
    this.updateViewToggleUI();
  }

  updateMenuUI() {
    if (this.elements.drawerMenu && this.elements.drawerOverlay) {
      if (this.state.menuOpen) {
        this.elements.drawerMenu.classList.add('open');
        this.elements.drawerOverlay.classList.add('active');
      } else {
        this.elements.drawerMenu.classList.remove('open');
        this.elements.drawerOverlay.classList.remove('active');
      }
    }
  }

  updateBackButtonVisibility() {
    const shouldShow = this.shouldShowBackButton();
    this.state.backButtonVisible = shouldShow;
    
    if (this.elements.backBtn) {
      this.elements.backBtn.style.display = shouldShow ? 'flex' : 'none';
      console.log('IndependentTopNavManager: Back button visibility:', shouldShow);
    }
  }

  updateViewToggleUI() {
    if (this.elements.viewToggleBtn) {
      // Actualizar texto del botón
      this.elements.viewToggleBtn.textContent = this.state.viewMode === 'table' ? '🔲' : '📋';
      
      // Actualizar aria-label
      const ariaLabel = this.state.viewMode === 'table' ? 
        'Cambiar a vista de cuadrícula' : 
        'Cambiar a vista de tabla';
      this.elements.viewToggleBtn.setAttribute('aria-label', ariaLabel);
      
      // Actualizar clase active
      this.elements.viewToggleBtn.classList.toggle('active', this.state.viewMode === 'grid');
      
      // Siempre visible
      this.elements.viewToggleBtn.style.display = 'flex';
    }
  }

  showTopNav() {
    if (this.elements.topNav) {
      this.elements.topNav.classList.add('show');
      document.body.classList.add('top-nav-visible');
      console.log('IndependentTopNavManager: Top navigation shown');
    }
  }

  // === MÉTODOS PÚBLICOS ===

  updateTitle(title) {
    if (this.elements.navTitle) {
      this.elements.navTitle.textContent = title;
      console.log('IndependentTopNavManager: Title updated to:', title);
    }
  }

  setViewMode(mode) {
    if (['table', 'grid'].includes(mode)) {
      this.state.viewMode = mode;
      this.saveState();
      this.updateViewToggleUI();
      console.log('IndependentTopNavManager: View mode set to:', mode);
    }
  }

  getViewMode() {
    return this.state.viewMode;
  }

  refresh() {
    // Método para refrescar el estado y UI
    this.loadState();
    this.updateUI();
    console.log('IndependentTopNavManager: Refreshed');
  }

  // Método para compatibilidad con el sistema anterior
  forceSync() {
    console.log('IndependentTopNavManager: forceSync called (compatibility method)');
    this.refresh();
  }
}

// No inicializar automáticamente - será controlado externamente
// window.independentTopNavManager = new IndependentTopNavManager();

// Hacer la clase disponible globalmente
window.IndependentTopNavManager = IndependentTopNavManager;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IndependentTopNavManager;
}