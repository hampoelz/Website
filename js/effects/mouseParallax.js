document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementsByClassName("bg-container")[0];
    const header = document.getElementsByClassName("header")[0];

    new MouseParallax([background, header]);
});

class MouseParallax {
    constructor(layerElements, options = { multiplier: 0.001 }) {
        this.mul = options.multiplier;
        this.layer = layerElements;
        this.start();
    }

    start() {
        let effect = this;
        let mousePos = { x: 0, y: 0 };

        document.addEventListener("mousemove", event => mousePos = { x: event.clientX, y: event.clientY });

        gsap.ticker.add(() => {
            let width = window.innerWidth / 2;
            let height = window.innerHeight / 2;

            for (let i = 0; i < effect.layer.length; i++) {
                const multiplier = effect.mul * (i + 1);
                
                gsap.to(effect.layer[i], {
                    duration: 1,
                    ease: 'power1.out',
                    yPercent: (height - mousePos.y) * multiplier,
                    xPercent: (width - mousePos.x) * multiplier
                });
            }
        });
        gsap.ticker.lagSmoothing()
    }
}