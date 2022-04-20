const isLightTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

const updateTheme = () => {
    this.isLightTheme = isLightTheme();

    if (document.documentElement.hasAttribute('force-light')) this.isLightTheme = true;
    else if (document.documentElement.hasAttribute('force-dark')) this.isLightTheme = false;

    if (this.isLightTheme) document.documentElement.setAttribute('light', true);
    else document.documentElement.removeAttribute('light');    
}

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type == "attributes") {
            if (mutation.attributeName == 'light') window.dispatchEvent(new Event('resize')); // trigger to update values in gsap
            if (mutation.attributeName == 'force-light' || mutation.attributeName == 'force-dark') updateTheme();
        }        
    });
}).observe(document.documentElement, { attributes: true });

// TODO: Warning when website breaks because of zoom

let scroll;

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateTheme);

document.addEventListener('DOMContentLoaded', () => {
    updateTheme();

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