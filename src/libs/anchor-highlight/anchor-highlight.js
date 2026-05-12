class AnchorHighlight {
  selectors = {
    main: '[data-anchor-highlight]',
    link: '[data-anchor-highlight-link]',
    duration: '[data-anchor-highlight-duration]',
  };

  stateClasses = {
    isHighlight: 'is-anchor-highlighted',
  };

  constructor(options = {}) {
    this.duration = parseFloat(options.duration) || 2000;

    this.injectStyles();
    this.bindEvents();
    this.initOnLoad();
  };

  injectStyles() {
    const style = document.createElement('style');
    
    style.textContent = `
      @keyframes anchor-highlight-pulse {
        0% { 
          background-color: rgba(212, 193, 127, 0);
        }
        30% { 
          background-color: rgba(212, 193, 127, 0.4);
        }
        60% { 
          background-color: rgba(212, 193, 127, 0.2);
        }
        100% {
          background-color: rgba(212, 193, 127, 0);
        }
      }

      .${this.stateClasses.isHighlight} {
        animation: anchor-highlight-pulse 0.8s ease-in-out infinite !important;
      }
    `;
    document.head.appendChild(style);
  };

initOnLoad = () => {
  const id = window.location.hash.replace('#', '');
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  // Скролл должен работать ВСЕГДА, чтобы работали стрелки браузера
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth' });
    
    // А подсвечиваем только если это "наш" блок
    const mainAttr = this.selectors.main.slice(1, -1);
    const linkAttr = this.selectors.link.slice(1, -1);

    if (target.hasAttribute(mainAttr) || target.hasAttribute(linkAttr)) {
      this.highlight([target]);
    }
  });
};



  highlight = (elements, customDuraion) => {
    elements.forEach(element => {
      element.classList.add(this.stateClasses.isHighlight);

      setTimeout(() => {
        element.classList.remove(this.stateClasses.isHighlight);
      }, customDuraion || this.duration);
    });
  };

  anchorHighlight = event => {
    const trigger = event.target.closest(`${this.selectors.main}, ${this.selectors.link}`);
    if (!trigger) return;

    if (trigger.tagName === 'LINK' || trigger.tagName === 'BASE') {
      console.warn('Are you even dumb?)');
      return;
    };

    let id = '';

    if (trigger.tagName === 'A' || trigger.tagName === 'AREA') {
      const href = trigger.getAttribute('href');
      if (href && href.includes('#')) {
        id = href.split('#')[1];
      };
    } else {
      id = (trigger.getAttribute(this.selectors.main.slice(1, -1)) || 
           trigger.getAttribute(this.selectors.link.slice(1, -1)))?.replace('#', '');
    };

    if (!id) return;

    const anchors = document.querySelectorAll(`[id="${id}"]`);

    if (anchors.length) {
      const isSmoothCSS = window.getComputedStyle(document.documentElement).scrollBehavior === 'smooth' ||
                          window.getComputedStyle(document.body).scrollBehavior === 'smooth';

      if (trigger.tagName === 'A' || trigger.tagName === 'AREA') {
        if (!isSmoothCSS) {
          event.preventDefault();
          anchors[0].scrollIntoView({ behavior: 'smooth' });
        };
      } else {
        anchors[0].scrollIntoView({ behavior: 'smooth' });
      };

      history.pushState(null, null, `#${id}`);

      const durationRaw = trigger.getAttribute(this.selectors.duration.slice(1, -1));
      let customDuration = parseFloat(durationRaw);

      if (durationRaw && durationRaw.includes('s') && !durationRaw.includes('ms')) {
        customDuration *= 1000;
      };

      this.highlight(anchors, customDuration || this.duration);
    };
  };

  bindEvents = () => {
    document.addEventListener('click', this.anchorHighlight);
    window.addEventListener('popstate', this.initOnLoad);
  };
};

if (document.querySelectorAll('[data-anchor-highlight]').length ||
    document.querySelectorAll('[data-anchor-highlight-link]').length) {
      new AnchorHighlight();
};