class Mouse {
    static #hoverClasses = Object.assign({
        'clickable':            'cursor-style-click',
        'c-scrollbar_thumb':    'cursor-style-move',
        'cursor-move':          'cursor-style-move',
        'cursor-move_down':     'cursor-style-move_down',
        'cursor-hover':         'cursor-style-hand',
        'cursor-visit':         'cursor-style-visit',
        'cursor-me':            'cursor-style-me',
        'cursor-glitch-start':  'cursor-glitch-start',
        'cursor-glitch-stop':   'cursor-glitch-stop',
    }, {
        default: 'cursor-style-normal'
    })

    static #hoverAnimations = {
        'cursor-style-click': () => gsap.fromTo('#cursor #cursor_click',
            { yPercent: 50, xPercent: -100, opacity: 0 },
            { yPercent: 0, xPercent: 0, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true }
        ),
        'cursor-style-move': () => gsap.timeline(
            { delay: .2, defaults: { duration: .2, ease: 'back.out', overwrite: true } }
        )
            .fromTo('#cursor #cursor_move .cursor-icon:first-child',
                { yPercent: 50, opacity: 0 },
                { yPercent: -10, opacity: 1 }, '<'
            )
            .fromTo('#cursor #cursor_move .cursor-icon:last-child',
                { yPercent: -50, opacity: 0 },
                { yPercent: 10, opacity: 1 }, '<'
            ),
        'cursor-style-move_down': () => gsap.fromTo('#cursor #cursor_move_down',
            { yPercent: -50, opacity: 0 },
            { yPercent: 0, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true }
        ),
        'cursor-glitch-start': () => {
            gsap.fromTo('#cursor #cursor_error',
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true }
            )
            document.getElementById('cursor').classList.add('glitch-container', 'glitch')
        },
        'cursor-glitch-stop': () => document.getElementById('cursor').classList.remove('glitch-container', 'glitch'),
    }

    static #clickAnimations = {
        'cursor-style-click': {
            down: () => gsap.to('#cursor #cursor_click', { yPercent: -10, xPercent: 20, duration: .2 }),
            up: () => gsap.to('#cursor #cursor_click', { yPercent: 0, xPercent: 0, duration: .2 })
        },
        'cursor-style-move': {
            down: () => gsap.timeline({ defaults: { duration: .1 } })
                .to('#cursor #cursor_move .cursor-icon:first-child', { yPercent: 0 })
                .to('#cursor #cursor_move .cursor-icon:last-child', { yPercent: 0 }, '<'),
            up: () => gsap.timeline({ defaults: { duration: .1 } })
                .to('#cursor #cursor_move .cursor-icon:first-child', { yPercent: -10 })
                .to('#cursor #cursor_move .cursor-icon:last-child', { yPercent: 10 }, '<')
        },
        'cursor-style-move_down': {
            down: () => {
                gsap.to('#cursor #cursor_move_down', { yPercent: 10, duration: .2 })

                document.addEventListener('mouseup', event => {
                    let position = parseInt(Array.from(event.target.classList).find(className => className.startsWith('move_down-')).replace('move_down-', ''));
                    if (position) scroll.scrollTo(position);
                }, { once: true });
            },
            up: () => gsap.to('#cursor #cursor_move_down', { yPercent: 0, duration: .2 })
        }
    }

    static removeMousePointer() {
        const insertRule = () => stylesheet.insertRule('* { cursor: auto; }', 0);
        let stylesheet;
        try {
            stylesheet = new CSSStyleSheet();
            insertRule();
            document.adoptedStyleSheets = [stylesheet];
        } catch {
            let stylesheets = document.styleSheets;

            for (let i = 0; i < stylesheets.length; i++) {
                if (stylesheets[i].href.includes('css/mouse.css')) {
                    stylesheet = stylesheets[i];
                    break;
                } 
            }

            insertRule();
        }

        let cursor = document.createElement('canvas'),
            ctx = cursor.getContext('2d');

        cursor.width = 1;
        cursor.height = 1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.fillRect(0, 0, cursor.width, cursor.height);

        const rules = stylesheet.cssRules;
        rules[0].style.setProperty('cursor', 'url(' + cursor.toDataURL() + '), auto', 'important');
    }

    static trackMouse(mousePointer, mouseCursor) {
        let disabled = false;
        document.addEventListener('touchstart', () => { disabled = true; });

        // Calculate cursor top and left position to place it centered around the mouse pointer
        let cursorMiddle = {
            top: pointer => pointer - parseFloat(window.getComputedStyle(mouseCursor).height) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderTopWidth) + parseFloat(window.getComputedStyle(mousePointer).height) / 2,
            left: pointer => pointer - parseFloat(window.getComputedStyle(mouseCursor).width) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderLeftWidth) + parseFloat(window.getComputedStyle(mousePointer).width) / 2
        }

        document.addEventListener('mousemove', event => {
            if (disabled) {
                disabled = false;
                return;
            }

            gsap.to(mouseCursor, {
                duration: 1.5,
                ease: 'expo.out',
                top: cursorMiddle.top(event.clientY),
                left: cursorMiddle.left(event.clientX)
            });

            mousePointer.style.top = event.clientY + "px";
            mousePointer.style.left = event.clientX + "px";
        });
    }

    static initHoverEffects(mousePointer) {
        document.addEventListener('mouseover', event => {
            const classList = event.target.classList;
            const key = Object.keys(this.#hoverClasses).find(key => classList.contains(key)) ?? 'default';
            const values = Array.from(new Set(Object.values(this.#hoverClasses)));
            const value = this.#hoverClasses[key];

            values.splice(values.indexOf(value), 1)

            mousePointer.classList.add(value);
            mousePointer.classList.remove(...values);
        });
    }

    static initHoverAnimations(mousePointer) {
        let hoverAnimation = false;
        let lastKey;

        gsap.ticker.add(() => {
            const key = Object.keys(this.#hoverAnimations).find(key => mousePointer.classList.contains(key));

            if (lastKey != key) hoverAnimation = true;
            if (hoverAnimation && key) {
                hoverAnimation = false;
                lastKey = key;
                this.#hoverAnimations[key].call();
            }
        });
    }

    static initClickAnimations(mousePointer) {
        let clickAnimation = true;

        document.addEventListener('mousedown', () => {
            const key = Object.keys(this.#clickAnimations).find(key => mousePointer.classList.contains(key));

            if (clickAnimation && key) {
                clickAnimation = false;
                let animation = this.#clickAnimations[key].down;
                if (animation) animation.call();
            }
        });

        document.addEventListener('mouseup', () => {
            clickAnimation = true

            const key = Object.keys(this.#clickAnimations).find(key => mousePointer.classList.contains(key));
            if (clickAnimation && key) {
                let animation = this.#clickAnimations[key].up;
                if (animation) animation.call();
            }
        })
    }
}