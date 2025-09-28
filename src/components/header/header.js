class Header {
  selectors = {
    header: '[data-js-header]',
    menu: '[data-js-header-menu]',
    menuButton: '[data-js-header-menu-button]',
    menuIcon: '[data-js-header-menu-icon]',
    menuButtonText: '[data-js-header-menu-button-text]',
  };

  stateClasses = {
    open: 'open',
    scroll: 'scroll',
    scrollLock: 'scroll-lock',
  };

  attrs = {
    inert: 'inert',
    ariaExpanded: 'aria-expanded',
  };

  media = {
    mobile: 61.9988, // 61.9988rem - 991.98px
  };

  constructor() {
    this.rootElement = document.documentElement;
    this.headerElement = document.querySelector(this.selectors.header);
    this.menuElement = document.querySelector(this.selectors.menu);
    this.menuButtonElement = document.querySelector(this.selectors.menuButton);
    this.menuIconElement = document.querySelector(this.selectors.menuIcon);
    this.menuButtonTextElement = document.querySelector(this.selectors.menuButtonText);

    this.mobileMediaQuery = window.matchMedia(`(width <= ${this.media.mobile}rem)`);

    this.menuIsExpanded = false;

    this.bindEvents();
    this.adaptiveMenu();
  };

  openMenu = () => {
    this.rootElement.classList.add(this.stateClasses.scrollLock);

    this.menuElement.classList.add(this.stateClasses.open);

    this.menuIconElement.classList.add(this.stateClasses.open);

    this.menuButtonTextElement.textContent = 'Закрыть меню';

    this.adaptiveMenu();
  };


  closeMenu = () => {
    this.rootElement.classList.remove(this.stateClasses.scrollLock);

    this.menuElement.classList.remove(this.stateClasses.open);

    this.menuIconElement.classList.remove(this.stateClasses.open);

    this.menuButtonTextElement.textContent = 'Открыть меню';

    this.adaptiveMenu();   
  };

  onMenuButtonClick = () => {
    this.menuElement.classList.contains(this.stateClasses.open) ?
      this.closeMenu() :
      this.openMenu();
  };

  adaptiveMenu = () => {
    if (this.mobileMediaQuery.matches) {
      if (this.menuElement.classList.contains(this.stateClasses.open)) {
        this.menuElement.removeAttribute(this.attrs.inert);
      } else {
          this.menuElement.setAttribute(this.attrs.inert, '');
      };
    } else {
      this.menuElement.removeAttribute(this.attrs.inert);
    };
  };

  menuToggleAttr = () => {
    if (this.menuIsExpanded === false) {
      this.menuButtonElement.setAttribute(this.attrs.ariaExpanded, 'true');
      this.menuIsExpanded = true;
    } else if (this.menuIsExpanded === true) {
      this.menuButtonElement.setAttribute(this.attrs.ariaExpanded, 'false');
      this.menuIsExpanded = false;
    };
  };

  fixedHeader = () => {
    const parentContainer = this.headerElement.parentElement;

    const existingPlaceholder = parentContainer.querySelector('.header__placeholder');

    if (window.scrollY > 10) {
      this.headerElement.classList.add(this.stateClasses.scroll);

      if (!existingPlaceholder) {
        const placeholderElement = document.createElement('div');
        placeholderElement.className = 'header__placeholder';

        parentContainer.insertAdjacentElement('afterbegin', placeholderElement);
      };

    } else {
      this.headerElement.classList.remove(this.stateClasses.scroll);
      if (existingPlaceholder) {
        existingPlaceholder.remove();
      }
    };
  };

  bindEvents() {
    this.menuButtonElement.addEventListener('click', this.onMenuButtonClick);
    document.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === 'Space') {
        this.onMenuButtonClick;
      };
    });
    document.addEventListener('keydown', event => {
      if (this.menuElement.classList.contains(this.stateClasses.open)) {
        if (event.key === 'Escape') {
          this.closeMenu();
        };
      };
    });
    this.menuButtonElement.addEventListener('click', this.menuToggleAttr);
    this.mobileMediaQuery.addEventListener('change', this.adaptiveMenu);
    window.addEventListener('scroll', () => this.fixedHeader());
  };
};
if (document.querySelector('.header') &&
   document.querySelector('.header__menu') && 
   document.querySelector('.header__menu-button') && 
   document.querySelector('.header__menu-icon') &&
   document.querySelector('.header__menu-button-text')) {
  new Header();
};