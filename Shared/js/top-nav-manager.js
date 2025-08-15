/**
 * Simple Top Navigation Manager
 * Manages the visibility and basic functionality of the top navigation bar
 */
class SimpleTopNavManager {
    constructor() {
        this.topNav = document.querySelector('#top-nav');
        this.initialized = false;
        this.init();
    }

    init() {
        if (!this.topNav) {
            console.warn('Top navigation element not found');
            return;
        }

        // Show the top navigation bar
        this.show();
        this.initialized = true;
        console.log('Simple Top Navigation Manager initialized');
    }

    show() {
        if (this.topNav) {
            this.topNav.classList.add('show');
            console.log('Top navigation bar shown');
        }
    }

    hide() {
        if (this.topNav) {
            this.topNav.classList.remove('show');
            console.log('Top navigation bar hidden');
        }
    }

    toggle() {
        if (this.topNav) {
            this.topNav.classList.toggle('show');
        }
    }
}

// Make it available globally
window.SimpleTopNavManager = SimpleTopNavManager;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleTopNavManager = new SimpleTopNavManager();
    });
} else {
    window.simpleTopNavManager = new SimpleTopNavManager();
}