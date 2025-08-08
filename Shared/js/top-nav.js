/**
 * BARRA SUPERIOR GLOBAL - SISTEMA DE SINCRONIZACIÓN
 * Maneja la sincronización entre los botones de la barra superior y los botones originales
 */

class TopNavManager {
  constructor() {
    this.isInitialized = false;
    this.originalButtons = {
      hamburger: null,
      back: null,
      viewToggle: null
    };
    this.topButtons = {
      hamburger: null,
      back: null,
      viewToggle: null
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
    this.findButtons();
    this.setupEventListeners();
    this.setupMutationObserver();
    this.syncInitialStates();
    this.setupContentReadyListener();
    this.isInitialized = true;
    
    console.log('TopNavManager initialized');
  }

  findButtons() {
    // Botones de la barra superior global
    this.topButtons.hamburger = document.getElementById('top-hamburger-btn');
    this.topButtons.back = document.getElementById('top-back-btn');
    this.topButtons.viewToggle = document.getElementById('top-view-toggle-btn');
    
    // Botones originales con búsqueda más exhaustiva
    this.originalButtons.hamburger = document.getElementById('hamburger-btn');
    this.originalButtons.back = document.querySelector('.back-button-container .back-button') ||
                               document.querySelector('.back-button') ||
                               document.querySelector('#back-btn');
    this.originalButtons.viewToggle = document.querySelector('.view-toggle-btn, #view-toggle-btn');
    
    console.log('TopNavManager: Buttons found:', {
      topHamburger: !!this.topButtons.hamburger,
      topBack: !!this.topButtons.back,
      topViewToggle: !!this.topButtons.viewToggle,
      originalHamburger: !!this.originalButtons.hamburger,
      originalBack: !!this.originalButtons.back,
      originalViewToggle: !!this.originalButtons.viewToggle
    });
  }

  setupEventListeners() {
    // Event listeners para botones de la barra superior global
    if (this.topButtons.hamburger) {
      this.topButtons.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleHamburgerClick();
      });
    }

    if (this.topButtons.back) {
      this.topButtons.back.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBackClick();
      });
    }

    if (this.topButtons.viewToggle) {
      this.topButtons.viewToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleViewToggleClick();
      });
    }
  }

  handleHamburgerClick() {
    const drawerMenu = document.getElementById('drawer-menu');
    const drawerOverlay = document.getElementById('drawer-overlay');
    
    if (drawerMenu && drawerOverlay) {
      drawerMenu.classList.toggle('open');
      drawerOverlay.classList.toggle('active');
    }
  }

  handleBackClick() {
    // Buscar el contenedor principal para renderizar licores
    const container = document.querySelector('.content-wrapper') || document.querySelector('#content-container');
    if (container && window.ProductRenderer && window.ProductRenderer.renderLicores) {
      window.ProductRenderer.renderLicores(container);
    }
  }

  handleViewToggleClick() {
    if (window.ProductRenderer && window.ProductRenderer.toggleViewMode) {
      const newMode = window.ProductRenderer.toggleViewMode();
      
      // Actualizar el botón de vista de la barra superior
      if (this.topButtons.viewToggle) {
        this.topButtons.viewToggle.textContent = newMode === 'table' ? '📋' : '🔲';
        this.topButtons.viewToggle.classList.toggle('active', newMode === 'grid');
      }
      
      // Refrescar la vista actual
      const container = document.querySelector('.content-wrapper') || document.querySelector('#content-container');
      if (container && window.ProductRenderer.refreshCurrentView) {
        window.ProductRenderer.refreshCurrentView(container);
      }
    }
  }

  setupMutationObserver() {
    // Observar cambios en el DOM para detectar botones dinámicos
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Verificar si se agregaron o removieron botones
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Verificar el nodo directamente
              if (node.classList?.contains('back-button') || 
                  node.classList?.contains('view-toggle-btn') ||
                  node.classList?.contains('back-button-container') ||
                  node.id === 'back-btn' || 
                  node.id === 'view-toggle-btn') {
                shouldUpdate = true;
              }
              
              // Verificar descendientes del nodo agregado
              const backButtons = node.querySelectorAll?.('.back-button, .back-button-container .back-button, #back-btn');
              const viewToggleButtons = node.querySelectorAll?.('.view-toggle-btn, #view-toggle-btn');
              
              if (backButtons?.length > 0 || viewToggleButtons?.length > 0) {
                shouldUpdate = true;
              }
            }
          });
          
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList?.contains('back-button') || 
                  node.classList?.contains('view-toggle-btn') ||
                  node.classList?.contains('back-button-container') ||
                  node.id === 'back-btn' || 
                  node.id === 'view-toggle-btn') {
                shouldUpdate = true;
              }
            }
          });
        }
        
        // Observar cambios de atributos (como style.display)
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          const target = mutation.target;
          if (target.classList?.contains('back-button') || 
              target.classList?.contains('view-toggle-btn') ||
              target.id === 'back-btn' || 
              target.id === 'view-toggle-btn') {
            shouldUpdate = true;
          }
        }
        
        // Observar cambios en el contenido de texto del botón de vista
        if (mutation.type === 'characterData' || 
            (mutation.type === 'childList' && mutation.target.classList?.contains('view-toggle-btn'))) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        // Aumentar el timeout para asegurar que el DOM esté completamente actualizado
        setTimeout(() => {
          this.findButtons();
          this.syncStates();
          console.log('TopNavManager: Buttons synchronized after DOM change');
        }, 100);
      }
    });

    // Observar todo el documento
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
      characterData: true,
      characterDataOldValue: true
    });
  }

  setupContentReadyListener() {
    // Escuchar el evento que indica que la inicialización del contenido ha terminado
    document.addEventListener('app-content-ready', () => {
      this.showTopNav();
    });
  }

  showTopNav() {
    const topNav = document.getElementById('top-nav');
    if (topNav) {
      topNav.classList.add('show');
      document.body.classList.add('top-nav-visible');
      console.log('Top navigation bar shown after content initialization');
    }
  }

  syncInitialStates() {
    this.syncStates();
  }

  syncStates() {
    // Sincronizar visibilidad del botón de retroceso
    this.syncBackButtonVisibility();
    
    // Sincronizar estado del botón de vista
    this.syncViewToggleState();
    
    // Sincronizar texto del botón de vista
    this.syncViewToggleText();
  }

  syncBackButtonVisibility() {
    // Buscar el botón de retroceso con múltiples selectores
    const backButton = this.originalButtons.back || 
                      document.querySelector('.back-button-container .back-button') ||
                      document.querySelector('.back-button') ||
                      document.querySelector('#back-btn');
    
    let isVisible = false;
    
    if (backButton) {
      const computedStyle = getComputedStyle(backButton);
      const isDisplayed = computedStyle.display !== 'none';
      const isNotHidden = computedStyle.visibility !== 'hidden';
      const hasOpacity = parseFloat(computedStyle.opacity) > 0;
      
      // For fixed positioned elements, offsetParent can be null even when visible
      // So we check display, visibility, and opacity instead
      isVisible = isDisplayed && isNotHidden && hasOpacity;
      
      console.log('TopNavManager: Back button found and visibility check:', {
        element: backButton,
        position: computedStyle.position,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        offsetParent: backButton.offsetParent,
        isVisible: isVisible
      });
    } else {
      console.log('TopNavManager: No back button found in DOM');
    }
    
    // Sincronizar visibilidad en la barra superior
    if (this.topButtons.back) {
      this.topButtons.back.style.display = isVisible ? 'flex' : 'none';
      console.log(`TopNavManager: Top back button display set to: ${this.topButtons.back.style.display}`);
    } else {
      console.log('TopNavManager: Top back button not found');
    }
    
    if (!backButton) {
       if (this.topButtons.back) {
         this.topButtons.back.style.display = 'none';
       }
     }
  }

  syncViewToggleState() {
    const originalToggle = this.originalButtons.viewToggle;
    
    if (originalToggle) {
      const isActive = originalToggle.classList.contains('active');
      
      if (this.topButtons.viewToggle) {
        this.topButtons.viewToggle.classList.toggle('active', isActive);
        this.topButtons.viewToggle.style.display = 'flex';
      }
    } else {
      // El botón de vista de la barra superior siempre debe estar visible
      // independientemente del estado del botón original
      if (this.topButtons.viewToggle) {
        this.topButtons.viewToggle.style.display = 'flex';
      }
    }
  }

  syncViewToggleText() {
    const originalToggle = this.originalButtons.viewToggle;
    let textContent = '🔲'; // Default text
    let ariaLabel = 'Cambiar a vista de cuadrícula';
    
    if (originalToggle) {
      const text = originalToggle.textContent || originalToggle.innerHTML;
      if (text.includes('🔲')) {
        textContent = '🔲';
        ariaLabel = 'Cambiar a vista de cuadrícula';
      } else if (text.includes('📋')) {
        textContent = '📋';
        ariaLabel = 'Cambiar a vista de tabla';
      }
    }
    
    // Sincronizar texto en el botón de la barra superior
    if (this.topButtons.viewToggle) {
      this.topButtons.viewToggle.textContent = textContent;
      this.topButtons.viewToggle.setAttribute('aria-label', ariaLabel);
    }
  }

  // Método público para forzar sincronización
  forceSync() {
    console.log('TopNavManager: Executing forceSync');
    this.findButtons();
    this.syncStates();
  }
  


  // Método para actualizar el título de la barra
  updateTitle(title) {
    const titleElement = document.getElementById('nav-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
}

// Inicializar el manager globalmente
window.topNavManager = new TopNavManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TopNavManager;
}