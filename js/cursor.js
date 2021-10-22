document.addEventListener('DOMContentLoaded', () => {
    let mouseCursor = document.getElementById('cursor');

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
        if (window.getComputedStyle(event.target)['cursor'] == 'pointer' ||
            event.target.classList.contains('os-scrollbar-handle')) {
            mouseCursor.classList.add('pointer');
            mouseCursor.classList.remove('normal');
        } else {
            mouseCursor.classList.add('normal');
            mouseCursor.classList.remove('pointer');
        }
    });
});