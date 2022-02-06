class MouseHoverRipple extends Ripple {
    constructor(element, options) {
        super(element, options);
        this.init();
    }

    init() {
        this.element.addEventListener('mouseover', event => this.addRipple(event.clientX, event.clientY));
        this.element.addEventListener('mousemove', event => this.moveRipples(event.clientX, event.clientY));
        this.element.addEventListener('mouseleave', () => this.removeRipples());
    }
}