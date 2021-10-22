CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}

function colorCursor(stylesheet, color) {
    let cursor = document.createElement('canvas'),
        ctx = cursor.getContext('2d');

    cursor.width = 10;
    cursor.height = 10;

    ctx.fillStyle = color;
    ctx.roundRect(0, 0, cursor.width, cursor.height, 20).fill();

    //document.body.style.setProperty('cursor', )

    const rules = stylesheet.cssRules;
    rules[0].style.setProperty('cursor', 'url(' + cursor.toDataURL() + '), auto', 'important')
}

document.addEventListener('DOMContentLoaded', () => {
    const stylesheet = new CSSStyleSheet();
    stylesheet.insertRule('* { cursor: auto; }', 0);
    document.adoptedStyleSheets = [stylesheet];

    let mouseCursor = document.getElementById('cursor');
    
    colorCursor(stylesheet, window.getComputedStyle(mouseCursor).borderColor);

    let lock = false;
    let currentPos = { x: 0, y: 0 };
    let aimPos = { x: -1, y: -1 };

    function animate() {
        requestAnimationFrame(animate);

        let mul = 0.2;
        currentPos.x += (aimPos.x - currentPos.x) * mul;
        currentPos.y += (aimPos.y - currentPos.y) * mul;

        if (aimPos.y != -1) mouseCursor.style.top = currentPos.y + "px";
        if (aimPos.x != -1) mouseCursor.style.left = currentPos.x + "px";
    }

    animate();

    document.addEventListener('touchstart', () => { lock = true; });
    
    document.addEventListener('mousemove', event => {
        if (lock) {
            lock = false;
            return;
        }

        aimPos = {
            x: event.clientX,
            y: event.clientY
        };
    });

    document.addEventListener('mouseover', event => {
        if (event.target.classList.contains('clickable')) {
            mouseCursor.classList.add('click');
            mouseCursor.classList.remove('normal');
            mouseCursor.classList.remove('pointer');
            colorCursor(stylesheet, 'rgba(255, 255, 255, 0.1)');
        } else {
            colorCursor(stylesheet, window.getComputedStyle(mouseCursor).borderColor);

            if (event.target.classList.contains('hoverable') || event.target.classList.contains('os-scrollbar-handle')) {
                mouseCursor.classList.add('pointer');
                mouseCursor.classList.remove('click');
                mouseCursor.classList.remove('normal');
                
            } else {
                mouseCursor.classList.add('normal');
                mouseCursor.classList.remove('click');
                mouseCursor.classList.remove('pointer');
            }
        }
    });
});