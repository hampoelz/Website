document.addEventListener('DOMContentLoaded', () => {
    const viewport = OverlayScrollbars(document.body).getElements().viewport;
    const landingPage = document.querySelector("#landing-page");
    
    let timeline = gsap.timeline({
        scrollTrigger: {
            scroller: viewport,
            trigger: landingPage,
            start: "top top",
            end: "+=1000px", // TODO
            scrub: true,
            pin: true
        }
    });

    timeline
        .add('start')
        .to('.bg-item', { rotation: 40, opacity: 0, display: 'none' }, 'start')
        .to('.bg-item.item-1', { xPercent: -100, yPercent: -100 }, 'start')
        .to('.bg-item.item-2', { xPercent: 100, yPercent: -100 }, 'start')
        .to('.bg-item.item-3', { xPercent: -100, yPercent: 100 }, 'start')
        .to('.bg-item.item-4', { xPercent: 100, yPercent: 100 }, 'start')
        .to('#landing-page .header .title', { yPercent: -20, opacity: 0, display: 'none' })
    
});