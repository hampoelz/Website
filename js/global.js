const isLightTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

// TODO: Warning when website breaks because of zoom

const getStyle = query => {
    if (!query) return;
    let dummies = query.split(' ');
    let dummyList = [];

    for (let i = 0; i < dummies.length; i++) {
        const dummy = document.createElement('element-' + (new Date().getTime()));
        dummy.classList.add(...dummies[i].split('.').filter(n => n))
        dummyList.push(dummy);

        if (dummyList.length > 1) dummyList[i - 1].appendChild(dummy);
    }

    document.body.appendChild(dummyList[0]);

    let style = {};
    let computedStyle = getComputedStyle(dummyList[dummyList.length - 1]);
    for (let key in computedStyle)
        style[key] = computedStyle[key]

    dummyList.forEach(dummy => dummy.remove());
    return style;
}

let scroll;

document.addEventListener('DOMContentLoaded', () => {
    const mousePointer = document.getElementById('pointer');
    const mouseCursor = document.getElementById('cursor');

    Mouse.removeMousePointer()
    Mouse.trackMouse(mousePointer, mouseCursor)
    Mouse.initHoverEffects(mousePointer)
    Mouse.initHoverAnimations(mousePointer)
    Mouse.initClickAnimations(mousePointer);

    gsap.registerPlugin(ScrollTrigger);

    scroll = new LocomotiveScroll({
        el: document.querySelector(".smooth-scroll"),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scroll.el, {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: scroll.el.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.defaults({ scroller: scroll.el })
    ScrollTrigger.refresh();
});