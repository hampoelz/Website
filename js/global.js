const isLightTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

const updateTheme = () => {
    this.isLightTheme = isLightTheme();

    const currentTheme = localStorage.getItem("theme");
    const forceLight = document.documentElement.hasAttribute('force-light');
    const forceDark = document.documentElement.hasAttribute('force-dark');
    const forceNoTheme = document.documentElement.hasAttribute('force-no-theme');

    if (forceLight || forceDark) {
        if (forceLight) this.isLightTheme = true;
        else if (forceDark) this.isLightTheme = false;
        
        localStorage.setItem("theme", forceLight ? 'light' : 'dark');
    } else if (forceNoTheme)
        localStorage.removeItem("theme");
    else if (currentTheme)
        this.isLightTheme = currentTheme == 'light';

    if (this.isLightTheme) document.documentElement.setAttribute('light', true);
    else document.documentElement.removeAttribute('light');
}

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type == "attributes") {
            if (mutation.attributeName == 'light') window.dispatchEvent(new Event('resize')); // trigger to update values in gsap
            if (mutation.attributeName.match(/force-(light|dark|no-theme)/gm)) updateTheme();
        }        
    });
}).observe(document.documentElement, { attributes: true });

const getCssVariable = name => getComputedStyle(document.documentElement).getPropertyValue(name);

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

    PIXI.utils.skipHello();
});