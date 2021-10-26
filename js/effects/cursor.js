document.addEventListener('DOMContentLoaded', () => {
    let mousePointer = document.getElementById('pointer');
    let mouseCursor = document.getElementById('cursor');

    removeMousePointer();
    trackMouse(mousePointer, mouseCursor);
    initHoverEffects(mousePointer);
    initHoverAnimations(mousePointer);
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

function trackMouse(mousePointer, mouseCursor) {
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

function initHoverEffects(mousePointer) {
    document.addEventListener('mouseover', event => {
        if (event.target.classList.contains('clickable')) {
            mousePointer.classList.add('click');
            mousePointer.classList.remove('normal', 'hand', 'move');
        } else if (event.target.classList.contains('os-scrollbar-handle')) {
            mousePointer.classList.add('move');
            mousePointer.classList.remove('normal', 'hand', 'click');
        } else if (event.target.classList.contains('hover')) {
            mousePointer.classList.add('hand');
            mousePointer.classList.remove('normal', 'click', 'move');
        } else {
            mousePointer.classList.add('normal');
            mousePointer.classList.remove('click', 'hand', 'move');
        }
    });
}

function initHoverAnimations(mousePointer) {
    let hoverAnimation = false;

    gsap.ticker.add(() => {
        if (hoverAnimation) {
            if (mousePointer.classList.contains('click')) {
                hoverAnimation = false;
                gsap.fromTo('#cursor #click',
                    { yPercent: 50, xPercent: -100, opacity: 0 },
                    { yPercent: 0, xPercent: 0, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true });
            } else if (mousePointer.classList.contains('move')) {
                hoverAnimation = false;
                gsap.fromTo('#cursor #move .cursor-icon:first-child',
                    { yPercent: 50, opacity: 0 },
                    { yPercent: -10, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true });
                gsap.fromTo('#cursor #move .cursor-icon:last-child',
                    { yPercent: -50, opacity: 0 },
                    { yPercent: 10, opacity: 1, delay: .2, duration: .2, ease: 'back.out', overwrite: true });
            }
        } else if (mousePointer.classList.contains('normal') || mousePointer.classList.contains('hand'))
            hoverAnimation = true;
    });
}