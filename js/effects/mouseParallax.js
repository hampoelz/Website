class MouseParallax {
    constructor(layerElements, options = { multiplier: 0.001 }) {
        this.mul = options.multiplier;
        this.layer = layerElements;
        this.start();
    }

    start() {
        let effect = this;
        let mouse = {
            currentPos: { x: 0, y: 0 },
            aimPos: { x: 0, y: 0 }
        };

        document.addEventListener("mousemove", event => {
            mouse.aimPos = {
                x: event.clientX,
                y: event.clientY
            };
        });

        function animation() {
            requestAnimationFrame(animation);

            let width = window.innerWidth / 2;
            let height = window.innerHeight / 2;

            mouse.currentPos.x += (mouse.aimPos.x - mouse.currentPos.x) * 0.1;
            mouse.currentPos.y += (mouse.aimPos.y - mouse.currentPos.y) * 0.1;

            for (let i = 0; i < effect.layer.length; i++) {
                const element = effect.layer[i];
                const multiplier = effect.mul * (i + 1);

                element.style.top = (height - mouse.currentPos.y) * multiplier + "%";
                element.style.left = (width - mouse.currentPos.x) * multiplier + "%";
            }
        }
        animation();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementsByClassName("bg-container")[0];
    const header = document.getElementsByClassName("header")[0];

    new MouseParallax([background, header]);
});