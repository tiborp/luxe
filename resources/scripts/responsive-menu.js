export default class ResponsiveMenu {
	constructor(container, options) {
		const defaults = {
			submenuClass: "menu__item--has-children",
			submenuToggleClass: "menu__submenu-toggle",
			menuToggleClass: "menu__toggle",
			menuClass: "menu__items",
			screenReaderClass: "screen-reader-text",
			openSubmenuText: "Open submenu",
			closeSubmenuText: "Close submenu",
			submenuToggleOpenIcon: menuIcons.submenuToggleOpenIcon,
			submenuToggleCloseIcon: menuIcons.submenuToggleCloseIcon,
			dropdownMenuIcon: menuIcons.dropdownMenuIcon
		};

		// Merge defaults with our passed options
		this.options = { ...defaults, ...options };

		this.container = document.getElementById(container);
		this.menu = this.container.getElementsByTagName("ul")[0];
		this.menuToggle = this.container.getElementsByTagName("button")[0];
		this.submenus = this.container.getElementsByClassName(
			this.options.submenuClass
		);
		this.submenuToggles = this.menu.getElementsByClassName(
			this.options.submenuToggleClass
		);

		// Setup the menu
		this._init();

		// Setup event listeners
		this._events();
	}

	// Handle everything that happens before events
	_init() {
		this.menuToggle.setAttribute("aria-expanded", "false");
		this._createSubmenuButtons();
		this._setStates();
	}

	// Handle all events
	_events() {
		// Remove ARIA when on "desktop".
		window.addEventListener("resize", () => this._setStates());
		window.addEventListener("resize", () => this._createSubmenuButtons());
		window.addEventListener("resize", () => this._removeSubmenuButtons());

		// Toggle ARIA states of main ul on click.
		this.menuToggle.addEventListener("click", () => {
			this._toggleMenu(this.menuToggle);
		});

		// Toggle Submenu aria attributes.
		[...this.submenuToggles].forEach(toggle => {
			toggle.addEventListener("click", () => this._toggleMenu(toggle));
		});

		// Close menu using Esc key.
		document.addEventListener("keyup", event => {
			if (27 === event.keyCode) {
				if (this._isMenuOpen()) {
					this._toggleMenu();
					this.menuToggle.focus();
				}
			}
		});
	}

	// Toggle menu classes and ARIA when button is pressed
	_toggleMenu(element) {
		let expanded =
			"false" === element.getAttribute("aria-expanded") ? true : false;
		element.setAttribute("aria-expanded", expanded);
	}

	// Add submenu button to any element that has children
	_createSubmenuButtons() {
		if(this._isMobile()) {
			[...this.submenus].forEach(element => {
				if (! element.classList.contains('menu__item--has-submenu-toggle')) {
					let anchor = element.getElementsByTagName("a")[0];
					let submenu = element.getElementsByTagName("ul")[0];
					let submenuToggle = document.createElement("button");
					let id = `submenu-${this._createUUID()}`;
					let submenuToggleText = this.options.openSubmenuText;
					let submenuToggleIcon = this.options.submenuToggleOpenIcon;

					element.classList.add('menu__item--has-submenu-toggle');

					// Add our new unique ID as an ID to the submenu
					submenu.setAttribute("id", id);

					// Add our new unique ID to match up with the button.
					submenuToggle.setAttribute("aria-controls", id);

					// Set aria-expanded to false by default.
					submenuToggle.setAttribute("aria-expanded", false);

					// Add class to button.
					submenuToggle.classList.add(this.options.submenuToggleClass);

					// Add icon to button - temporary to help visualise
					submenuToggle.innerHTML = `<span class="${
						this.options.screenReaderClass
					}">${submenuToggleText}</span>${submenuToggleIcon}`;

					// Add our new button after the anchor.
					anchor.after(submenuToggle);
				}
			});
		}
	}

	// Remove submenu toggles
	_removeSubmenuButtons() {
		if(!this._isMobile()) {
			let toRemove = document.getElementsByClassName('menu__submenu-toggle');

			[...toRemove].forEach(button => {
				button.parentNode.classList.remove('menu__item--has-submenu-toggle');
				button.parentNode.removeChild(button);
			});
		}
	}

	_setStates() {
		if (this._isMobile()) {
			this.container.classList.add("menu--is-mobile");
			this.container.classList.remove("menu--is-desktop");
			this.menuToggle.setAttribute("aria-expanded", "false");

			[...this.submenus].forEach(submenu => {
				submenu.removeAttribute("aria-haspopup");
			});

			[...this.submenuToggles].forEach(toggle => {
				toggle.style.display = "block";
			});
		} else {
			this.container.classList.add("menu--is-desktop");
			this.container.classList.remove("menu--is-mobile");
			this.menuToggle.setAttribute("aria-expanded", "false");

			[...this.submenus].forEach(submenu => {
				submenu.setAttribute("aria-haspopup", "true");
			});

			[...this.submenuToggles].forEach(toggle => {
				toggle.style.display = "none";
			});
		}
	}

	// Used to determind if we are on mobile or not
	_isMobile() {
		// If menu toggle button has display: none css rule, we're on desktop.
		let isMobile =
			"none" ===
			window.getComputedStyle(this.menuToggle, null).getPropertyValue("display")
				? false
				: true;
		return isMobile;
	}

	_isMenuOpen() {
		let isMenuOpen =
			"false" === this.menuToggle.getAttribute("aria-expanded") ? false : true;
		return isMenuOpen;
	}

	// Function to generate a Unique ID that can be used for the ID's for submenus, buttons etc
	_createUUID() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
}
