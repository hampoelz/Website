document.addEventListener('DOMContentLoaded', () => {
    const viewport = OverlayScrollbars(document.body).getElements().viewport;
    const landingPage = document.querySelector("#landing-page");
    
    let timeline = gsap.timeline({
        scrollTrigger: {
            scroller: viewport,
            trigger: landingPage,
            start: "top top",
            end: "+=1500px", // TODO
            scrub: true,
            pin: true
        }
    });

    let themeColors = {
        background: '#080808',
        foreground: '#FFFFFF'
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        themeColors = {
            background: '#F2F2F2',
            foreground: '#000000'
        }
    }

    timeline
        .add('background-out')
        .to('.bg-item', { rotation: 40, opacity: 0, display: 'none' }, 'background-out')
        .to('.bg-item.item-1', { xPercent: -100, yPercent: -100 }, 'background-out')
        .to('.bg-item.item-2', { xPercent: 100, yPercent: -100 }, 'background-out')
        .to('.bg-item.item-3', { xPercent: -100, yPercent: 100 }, 'background-out')
        .to('.bg-item.item-4', { xPercent: 100, yPercent: 100 }, 'background-out')
        .to('#landing-page', { backgroundColor: themeColors.background }, 'background-out')
        .to(document.body, {
            '--title-color': themeColors.foreground,
            '--title-bold-color': themeColors.background,
            '--title-bold-background': `${themeColors.foreground}CC`,
            '--os-theme-color': themeColors.foreground,
            '--cursor-color': '#450eff'
        }, 'background-out')
        .add('header-out')
        .to('#landing-page .header .title', { yPercent: -20, opacity: 0, display: 'none' }, 'header-out')
        .set('#landing-page .header', { display: 'none' })
        .set('#landing-page .bg-container', { display: 'none' })
        .add('biography-in')
        .to('#landing-page .biography', { yPercent: 10, opacity: 1, display: 'block' }, 'biography-in')
    
});