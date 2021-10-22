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

document.addEventListener('DOMContentLoaded', () => {
    let mousePointer = document.getElementById('pointer');
    let mouseCursor = document.getElementById('cursor');

    removeMousePointer();

    let lock = false;
    let currentPos = { x: 0, y: 0 };
    let aimPos = { x: -1, y: -1 };

    function animate() {
        requestAnimationFrame(animate);

        let mul = 0.2;
        currentPos.x += (aimPos.x - currentPos.x) * mul;
        currentPos.y += (aimPos.y - currentPos.y) * mul;

        if (aimPos.y != -1) mouseCursor.style.top = currentPos.y - parseFloat(window.getComputedStyle(mouseCursor).height) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderTopWidth) + parseFloat(window.getComputedStyle(mousePointer).height) / 2 + "px";
        if (aimPos.x != -1) mouseCursor.style.left = currentPos.x - parseFloat(window.getComputedStyle(mouseCursor).width) / 2 - parseFloat(window.getComputedStyle(mouseCursor).borderLeftWidth) + parseFloat(window.getComputedStyle(mousePointer).width) / 2 + "px";
    }

    animate();

    document.addEventListener('touchstart', () => { lock = true; });

    document.addEventListener('mousemove', event => {
        if (lock) {
            lock = false;
            return;
        }

        mousePointer.style.top = event.clientY + "px";
        mousePointer.style.left = event.clientX + "px";

        aimPos = {
            x: event.clientX,
            y: event.clientY
        };
    });

    document.addEventListener('mouseover', event => {
        if (event.target.classList.contains('clickable')) {
            mouseCursor.classList.add('click');
            mouseCursor.classList.remove('normal');
            mouseCursor.classList.remove('hand');
        } else if (event.target.classList.contains('hoverable') || event.target.classList.contains('os-scrollbar-handle')) {
            mouseCursor.classList.add('hand');
            mouseCursor.classList.remove('click');
            mouseCursor.classList.remove('normal');
        } else {
            mouseCursor.classList.add('normal');
            mouseCursor.classList.remove('click');
            mouseCursor.classList.remove('hand');
        }

    });
});