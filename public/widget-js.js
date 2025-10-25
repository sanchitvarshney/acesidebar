// Chat Widget JavaScript Functions

// Global widget functions
window.AjaxterWidget = {
  // Configuration
  config: null,
  
  // Initialize widget with configuration
  init: function(config) {
    this.config = config;
    this.setupEventListeners();
    // this.createButton(); // Disabled - button creation handled by main widget
    this.loadExternalFiles();
  },
  
  // Setup event listeners
  setupEventListeners: function() {
    // Handle window messages
    if (window.addEventListener) {
      window.addEventListener('message', (event) => {
        // Handle close message from iframe
        if (event.data && event.data.type === 'iframe' && event.data.close === true) {
          this.closeIframe();
        }
        
        // Handle unread message count
        if (event.data && event.data.type === 'unread_count') {
          this.updateUnreadCount(event.data.count || 0);
        }
        
        // Handle new message received
        if (event.data && event.data.type === 'new_message') {
          if (!this.isOpen) {
            this.incrementUnreadCount();
          }
        }
      });
    }
  },
  
  // Load external CSS and JS files
  loadExternalFiles: function() {
    const settings = this.config.settings;
    if (settings && settings.integrations) {
      // Load CSS
      if (settings.integrations.css) {
        const cssUrl = settings.integrations.css.replace(/[\[\]]/g, '');
        this.loadCSS(cssUrl);
      }
      
      // Load JS
      if (settings.integrations.js) {
        const jsUrl = settings.integrations.js.replace(/[\[\]]/g, '');
        this.loadJS(jsUrl);
      }
    }
  },
  
  // Load CSS file
  loadCSS: function(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  },
  
  // Load JS file
  loadJS: function(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.head.appendChild(script);
  },
  
  // Create button based on configuration
  createButton: function() {
    // Check if button already exists
    if (document.getElementById("support-toggle")) {
      console.log("Button already exists, skipping creation");
      return;
    }
    
    const bot = this.config.bot;
    const toggleBtn = document.createElement("div");
    toggleBtn.id = "support-toggle";
    
    // Set button content based on buttonText parameter
    if (bot.buttonText !== "default") {
      toggleBtn.classList.add("chat-button");
      // Truncate text if longer than 15 characters
      const displayText = bot.buttonText.length > 15 ? bot.buttonText.substring(0, 15) + '...' : bot.buttonText;
      toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
    } else {
      toggleBtn.innerHTML = this.getChatIcon();
    }
    
    // Set button color
    toggleBtn.style.setProperty('--button-color', bot.buttonColor);
    
    // Add unread badge
    const badge = document.createElement("div");
    badge.id = "support-badge";
    badge.textContent = "0";
    toggleBtn.appendChild(badge);
    
    document.body.appendChild(toggleBtn);
    this.positionButton(toggleBtn);
    this.attachButtonEvents(toggleBtn);
  },
  
  // Position button based on configuration
  positionButton: function(button) {
    const bot = this.config.bot;
    const btnStyle = button.style;
    
    // Clear any existing positioning first
    btnStyle.top = 'auto';
    btnStyle.bottom = 'auto';
    btnStyle.left = 'auto';
    btnStyle.right = 'auto';
    btnStyle.transform = 'none';
    
    if (bot.buttonText !== "default") {
      // Chat button positioning based on position parameter
      btnStyle.top = '50%';
      btnStyle.transform = 'translateY(-50%)';
      btnStyle.bottom = 'auto';
      
      if (bot.position === 'br') {
        btnStyle.right = '20px';
        btnStyle.left = 'auto';
      } else if (bot.position === 'bl') {
        btnStyle.left = '20px';
        btnStyle.right = 'auto';
      }
    } else {
      // Default button positioning
      if (window.innerWidth <= 768) {
        // Mobile positioning with safe area support
        if (bot.position === 'br') { 
          btnStyle.bottom = 'max(20px, env(safe-area-inset-bottom))'; 
          btnStyle.right = 'max(20px, env(safe-area-inset-right))'; 
          btnStyle.left = 'auto';
        }
        if (bot.position === 'bl') { 
          btnStyle.bottom = 'max(20px, env(safe-area-inset-bottom))'; 
          btnStyle.left = 'max(20px, env(safe-area-inset-left))'; 
          btnStyle.right = 'auto';
        }
      } else {
        // Desktop positioning
        if (bot.position === 'br') { 
          btnStyle.bottom = '20px'; 
          btnStyle.right = '20px'; 
          btnStyle.left = 'auto';
        }
        if (bot.position === 'bl') { 
          btnStyle.bottom = '20px'; 
          btnStyle.left = '20px'; 
          btnStyle.right = 'auto';
        }
      }
    }
  },
  
  // Attach button events
  attachButtonEvents: function(button) {
    button.addEventListener("click", () => this.toggleChat());
  },
  
  // Toggle chat function
  toggleChat: function() {
    console.log("toggleChat called");
    // This will be implemented in the main widget.js
    if (window.toggleChatWidget) {
      window.toggleChatWidget();
    }
  },
  
  // Get chat icon SVG
  getChatIcon: function() {
    return `<svg width="28" height="28" viewBox="0 0 16 16"><path d="M16,2 L16,10.44C16,11.55 15.1,12.44 14,12.44L11.91,12.44L11.91,16L7.74,12.44L2,12.44C0.9,12.44 0,11.55 0,10.44L0,2C0,0.9 0.9,0 2,0L14,0C15.1,0 16,0.9 16,2Z" fill="#fff"/></svg>`;
  },
  
  // Get cross icon SVG
  getCrossIcon: function() {
    return `<svg width="24" height="24" viewBox="0 0 14 14"><polygon fill="#fff" points="14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7"/></svg>`;
  },
  
  // Get loader HTML
  getLoader: function() {
    return `<div class="ajxtr-loader"></div>`;
  },
  
  // Update button content
  updateButtonContent: function(content) {
    const button = document.getElementById("support-toggle");
    if (button) {
      button.innerHTML = content;
    }
  },
  
  // Update unread count
  updateUnreadCount: function(count) {
    const badge = document.getElementById("support-badge");
    if (badge) {
      badge.textContent = count > 99 ? '99+' : count.toString();
      if (count > 0) {
        badge.classList.add('show');
        if (count === 1) {
          badge.classList.add('pulse');
          setTimeout(() => badge.classList.remove('pulse'), 600);
        }
      } else {
        badge.classList.remove('show');
      }
    }
  },
  
  // Close iframe
  closeIframe: function() {
    const frame = document.getElementById("support-frame");
    const toggleBtn = document.getElementById("support-toggle");
    
    if (frame && this.isOpen) {
      this.isOpen = false;
      
      const bot = this.config.bot;
      if (bot.sliderStyle === "slider") {
        // SLIDER CLOSE animation
        frame.classList.add("closing");
        if (toggleBtn) {
          if (bot.buttonText !== "default") {
            const displayText = bot.buttonText.length > 15 ? bot.buttonText.substring(0, 15) + '...' : bot.buttonText;
            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
          } else {
            toggleBtn.innerHTML = this.getChatIcon();
          }
        }
        frame.addEventListener("transitionend", function handler() {
          frame.classList.remove("open", "closing");
          frame.removeEventListener("transitionend", handler);
        });
      } else {
        // normal close for pop
        frame.classList.remove("open");
        if (toggleBtn) {
          if (bot.buttonText !== "default") {
            const displayText = bot.buttonText.length > 15 ? bot.buttonText.substring(0, 15) + '...' : bot.buttonText;
            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
          } else {
            toggleBtn.innerHTML = this.getChatIcon();
          }
        }
      }
    }
  },
  
  // Increment unread count
  incrementUnreadCount: function() {
    const badge = document.getElementById("support-badge");
    if (badge) {
      const currentCount = parseInt(badge.textContent) || 0;
      this.updateUnreadCount(currentCount + 1);
    }
  },
  
  // Widget state
  isOpen: false
};
