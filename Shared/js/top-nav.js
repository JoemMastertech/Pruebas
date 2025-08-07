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
    // Botones de la barra superior
    this.topButtons.hamburger = document.getElementById('top-hamburger-btn');
    this.topButtons.back = document.getElementById('top-back-btn');
    this.topButtons.viewToggle = document.getElementById('top-view-toggle-btn');
    
    // Botones originales
    this.originalButtons.hamburger = document.getElementById('hamburger-btn');
    this.originalButtons.back = document.querySelector('.back-button-container .back-button, .back-button, #back-btn');
    this.originalButtons.viewToggle = document.querySelector('.view-toggle-btn, #view-toggle-btn');
  }

  setupEventListeners() {
    // Hamburger button sync
    if (this.topButtons.hamburger) {
      this.topButtons.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.originalButtons.hamburger) {
          this.originalButtons.hamburger.click();
        }
      });
    }

    // Back button sync
    if (this.topButtons.back) {
      this.topButtons.back.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.originalButtons.back) {
          this.originalButtons.back.click();
        }
      });
    }

    // View toggle sync
    if (this.topButtons.viewToggle) {
      this.topButtons.viewToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.originalButtons.viewToggle) {
          this.originalButtons.viewToggle.click();
        }
      });
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
              if (node.classList?.contains('back-button') || 
                  node.classList?.contains('view-toggle-btn') ||
                  node.id === 'back-btn' || 
                  node.id === 'view-toggle-btn') {
                shouldUpdate = true;
              }
            }
          });
          
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList?.contains('back-button') || 
                  node.classList?.contains('view-toggle-btn') ||
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
        setTimeout(() => {
          this.findButtons();
          this.syncStates();
        }, 50);
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
    if (!this.topButtons.back) return;
    
    const backButton = this.originalButtons.back || 
                      document.querySelector('.back-button-container .back-button');
    
    if (backButton) {
      const isVisible = backButton.offsetParent !== null && 
                       getComputedStyle(backButton).display !== 'none';
      
      this.topButtons.back.style.display = isVisible ? 'flex' : 'none';
    } else {
      this.topButtons.back.style.display = 'none';
    }
  }

  syncViewToggleState() {
    if (!this.topButtons.viewToggle) return;
    
    // El botón de vista de la barra superior siempre debe estar visible
    // independientemente del estado del botón original
    this.topButtons.viewToggle.style.display = 'flex';
  }

  syncViewToggleText() {
    if (!this.topButtons.viewToggle) return;
    
    const viewToggle = this.originalButtons.viewToggle || 
                      document.querySelector('.view-toggle-btn');
    
    if (viewToggle) {
      const text = viewToggle.textContent || viewToggle.innerHTML;
      // Sincronizar exactamente el mismo icono que el botón original
      if (text.includes('🔲')) {
        // Si el original muestra 🔲 (modo tabla, para cambiar a grid)
        this.topButtons.viewToggle.textContent = '🔲';
        this.topButtons.viewToggle.setAttribute('aria-label', 'Cambiar a vista de cuadrícula');
      } else if (text.includes('📋')) {
        // Si el original muestra 📋 (modo grid, para cambiar a tabla)
        this.topButtons.viewToggle.textContent = '📋';
        this.topButtons.viewToggle.setAttribute('aria-label', 'Cambiar a vista de tabla');
      }
    } else {
      // Si no hay botón original, inicializar con estado por defecto (modo tabla)
      this.topButtons.viewToggle.textContent = '🔲';
      this.topButtons.viewToggle.setAttribute('aria-label', 'Cambiar a vista de cuadrícula');
    }
  }

  // Método público para forzar sincronización
  forceSync() {
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