class MouseMagnet {
    constructor(element, options) {
        let defaults = { hoverOffset: { max: .5, min: .3 }, magnetic: { scale: 1, rotation: 0, pullX: 0.5, pullY: 0.7 }};
        this.element = element;
        this.options = {
            hoverOffset: Object.assign({}, defaults.hoverOffset, options?.hoverOffset),
            magnetic: Object.assign({}, defaults.magnetic, options?.magnetic)
        }
        this.isHover = false;
        this.init();
    }

    init() {
        document.body.addEventListener('mousemove', event => this.magnetize(event.clientX, event.clientY));
    }

    magnetize(mouseX, mouseY) {
        const hoverArea = this.hover ? this.options.hoverOffset.max : this.options.hoverOffset.min;

        const elementRect = this.element.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        
        const width = this.element.clientWidth;
        const height = this.element.clientHeight;

        let offset = {
            top: elementRect.top - bodyRect.top,
            left: elementRect.left - bodyRect.left
        }

        let elementPos = {
            x: offset.left + width / 2,
            y: offset.top + height / 2
        };

        let x = mouseX - elementPos.x;
        let y = mouseY - elementPos.y;

        let dist = Math.sqrt(x * x + y * y);
        let mutHover = false;

        if (dist < width * hoverArea) {
            mutHover = true;
            if (!this.hover) this.hover = true;
            gsap.to(this.element, 0.4, {
                x: x * this.options.magnetic.pullX,
                y: y * this.options.magnetic.pullY,
                scale: this.options.magnetic.scale,
                rotation: x * this.options.magnetic.rotation,
                ease: 'power2.out'
            });
        }

        if (!mutHover && this.hover) {
            gsap.to(this.element, 0.7, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                ease: 'elastic.out(1.1, 0.5)'
            });
            this.hover = false;
        }
    }
}