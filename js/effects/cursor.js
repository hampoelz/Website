document.addEventListener('DOMContentLoaded', () => {
    let mousePointer = document.getElementById('pointer');
    let mouseCursor = document.getElementById('cursor');

    removeMousePointer();

    let lock = false;
    let cursorMiddle = {
        x: pointer => pointer - parseFloat(window.getComputedStyle(mouseCursor).width) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderLeftWidth) + parseFloat(window.getComputedStyle(mousePointer).width) / 2,
        y: pointer => pointer - parseFloat(window.getComputedStyle(mouseCursor).height) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderTopWidth) + parseFloat(window.getComputedStyle(mousePointer).height) / 2
    }

    document.addEventListener('touchstart', () => { lock = true; });

    document.addEventListener('mousemove', event => {
        if (lock) {
            lock = false;
            return;
        }

        gsap.to(mouseCursor, {
            duration: 1.5,
            ease: 'expo.out',
            top: cursorMiddle.y(event.clientY),
            left: cursorMiddle.x(event.clientX)
        });

        mousePointer.style.top = event.clientY + "px";
        mousePointer.style.left = event.clientX + "px";
    });

    let animateToggle = true;

    gsap.ticker.add(() => {
        if (mousePointer.classList.contains('click') && animateToggle) {
            animateToggle = false;
            gsap.fromTo('#cursor .cursor-icon',
                { yPercent: 50, xPercent: -100, opacity: 0 },
                { yPercent: 0, xPercent: 0, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true });
        } else if (!mousePointer.classList.contains('click')) {
            animateToggle = true;
        }
    });
    gsap.ticker.lagSmoothing()

    document.addEventListener('mouseover', event => {
        if (event.target.classList.contains('clickable')) {
            mousePointer.classList.add('click');
            mousePointer.classList.remove('normal', 'hand');
        } else if (event.target.classList.contains('hover') || event.target.classList.contains('os-scrollbar-handle')) {
            mousePointer.classList.add('hand');
            mousePointer.classList.remove('normal', 'click');
        } else {
            mousePointer.classList.add('normal');
            mousePointer.classList.remove('click', 'hand');
        }
    });
});

function removeMousePointer() {
    const stylesheet = new CSSStyleSheet();
    stylesheet.insertRule('* { cursor: auto; }', 0);
    document.adoptedStyleSheets = [stylesheet];

    let cursor = document.createElement('canvas'),
        ctx = cursor.getContext('2d');

    cursor.width = 1;
    cursor.height = 1;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, cursor.width, cursor.height);

    const rules = stylesheet.cssRules;
    rules[0].style.setProperty('cursor', 'url(' + cursor.toDataURL() + '), auto', 'important');
}