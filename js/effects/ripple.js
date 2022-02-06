class Ripple {
    constructor(element, options) {
        let defaults = { scale: 3, duration: 1, classList: [], color: '#450eff' };
        this.element = element;
        this.options = Object.assign({}, defaults, options);
        this.isRippleAdded = false;
    }

    addRipple(x, y) {
        if (this.isRippleAdded) return;
        this.isRippleAdded = true;

        const ripple = document.createElement("span");
        const diameter = Math.max(this.element.clientWidth, this.element.clientHeight);

        ripple.style.background = this.options.color;
        ripple.style.width = ripple.style.height = `${diameter}px`;

        this.setRipplePos(ripple, { x: x, y: y })

        ripple.classList.add('ripple');
        if (this.options.classList.length > 0) ripple.classList.add(this.options.classList);

        this.element.appendChild(ripple);

        gsap.to(ripple, {
            scale: this.options.scale,
            duration: this.options.duration
        })
    }

    moveRipples(x, y) {
        const rippleList = this.element.querySelectorAll(".ripple");

        for (let i = 0; i < rippleList.length; i++) {
            const ripple = rippleList[i];
            if (ripple) this.setRipplePos(ripple, { x: x, y: y });
        }
    }

    removeRipples() {
        const rippleList = this.element.querySelectorAll(".ripple");
        this.isRippleAdded = false;

        for (let i = 0; i < rippleList.length; i++) {
            const ripple = rippleList[i];
            if (!ripple) return;

            gsap.to(ripple, {
                scale: 0,
                duration: (this.options.duration / 2),
                onComplete: () => ripple.remove()
            });
        }
    }

    setRipplePos(rippleElement, mousePos = { x, y }) {
        const elementRect = this.element.getBoundingClientRect();
        const diameter = Math.max(this.element.clientWidth, this.element.clientHeight);
        const radius = diameter / 2;

        gsap.to(rippleElement, {
            left: mousePos.x - (elementRect.left + radius),
            top: mousePos.y - (elementRect.top + radius)
        });
    }
}