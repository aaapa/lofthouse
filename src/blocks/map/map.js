class MapIframe {
  selectors = {
    root: '[data-js-map]',
    view: '[data-js-map-view]',
    overlay: '[data-js-map-view-overlay]',
    iframe: '[data-js-map-iframe]',
  };

  stateClasses = {
    isHidden: 'is-hidden',
  };

  attrs = {
    ariaExpanded: 'aria-expanded',
    inert: 'inert',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.viewElement = this.rootElement.querySelector(this.selectors.view);
    this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
    this.iframeElement = this.rootElement.querySelector(this.selectors.iframe);

    this.bindEvents();
  };

  bindEvents = () => {
    document.addEventListener('click', event => {
      const isInside = this.viewElement.contains(event.target);
      
      this.overlayElement.classList.toggle(this.stateClasses.isHidden, isInside);
      this.iframeElement.toggleAttribute(this.attrs.inert, !isInside);
      this.overlayElement.setAttribute(this.attrs.ariaExpanded, 
        isInside ? 'true' : 'false'
      );
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.overlayElement.classList.contains(this.stateClasses.isHidden)) {
        this.overlayElement.classList.remove(this.stateClasses.isHidden);
        this.iframeElement.setAttribute(this.attrs.inert, '');
        this.overlayElement.setAttribute(this.attrs.ariaExpanded, 'false');
      };
    });
  };
};

if (document.querySelector('[data-js-map]') &&
    document.querySelector('[data-js-map-view]') &&
    document.querySelector('[data-js-map-view-overlay]') &&
    document.querySelector('[data-js-map-iframe]')) {
  new MapIframe();
};