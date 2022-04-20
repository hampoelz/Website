document.addEventListener('DOMContentLoaded', () => {
    const titles = [
        'Rene \x0BHAMPÖLZ\x00',
        'When it does not\nexist \x0B#DESIGN\x00 it',
        'When it does not\nexist \x0B#CREATE\x00 it'
    ];

    const startScroll = () => scroll.start();
    const stopScroll = () => {
        scroll.stop();
        scroll.scrollTo(scroll.scroll.instance.scroll.y, { duration: 1 });
    }

    const headerTitle = document.querySelector('#landing-page .header .title');
    const headerBackground = document.querySelectorAll("#landing-page .header .bg-container");

    const biographyPicture = document.querySelector("#landing-page .biography .profile .picture-container");
    const biographyPictureRipple = document.querySelector("#landing-page .biography .profile .picture-ripple");

    const textScramble = new TextScramble(headerTitle, {
        classList: ['hover'],
        mark: {
            char: '\x0B',
            classList: ['mark', 'move_down', 'move_down-500']
    }});
    new MouseParallax([headerTitle, headerBackground]);
    new MouseParallax([biographyPicture], { multiplier: 0.005 });
    new MouseHoverRipple(biographyPictureRipple, { scale: 3, classList: ['me'] });
    new MouseMagnet(biographyPicture);

    let counter = 0;
    const next = () => {
        textScramble.setText(titles[counter]).then(() => {
            setTimeout(next, counter == 0 ? 1500 : 4000);
            counter = counter == 2 ? 1 : counter + 1;
        });
    };
    next();

    let headerBgOut = gsap.timeline()
        .to(document.documentElement, {
            '--header-background-rgb': () => `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--background-rgb')})`,
            '--header-foreground-rgb': () => `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--foreground-rgb')})`,
            '--cursor-color': '#450eff'
        })
        .to('#landing-page', { backgroundColor: () => `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--background-rgb')})` }, '<')
        .to('#landing-page .header .bg-grid .bg-item', { rotation: 40, opacity: 0 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(1)', { xPercent: -100, yPercent: -100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(4)', { xPercent: 100, yPercent: -100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(2)', { xPercent: -100, yPercent: 100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(3)', { xPercent: 100, yPercent: 100 }, '<');

    let headerOut = gsap.timeline()
        .to('#landing-page .header .title', { yPercent: 20, opacity: 0 })
        .set('#landing-page .header', { display: 'none' });
    
    let biographyIn = gsap.timeline()
        .fromTo('#landing-page .biography .title, #landing-page .biography .profile', { yPercent: -10, opacity: 0 }, { yPercent: 0, opacity: 1 })
        .set('#landing-page .biography', { display: null  }, '<')

    /*
    let loadProjects = gsap.timeline({
        paused: true,
        onComplete: () => {
            startScroll();
            document.querySelector('#landing-page .ripple-transition h1').innerHTML = 'Unloading projects ...';
        },
        onReverseComplete: () => {
            startScroll();
            document.querySelector('#landing-page .ripple-transition h1').innerHTML = 'Loading projects ...';
        },
    })
        .to(document.body, { '--cursor-color': '#fe3218' })
        .set('#landing-page .ripple-transition', { display: null }, '<')
        .to('#landing-page .ripple-transition span.ripple', { duration: 2, scale: 4 }, '<')
        .fromTo('#landing-page .ripple-transition img', { scale: 0, yPercent: 25 }, { duration: .5, scale: 1, yPercent: 0 }, '<')
        .fromTo('#landing-page .ripple-transition progress', { minWidth: 0, width: 0, opacity: 0 }, { duration: .5, width: getComputedStyle(document.querySelector('#landing-page .ripple-transition progress')).width, opacity: 1, minWidth: getComputedStyle(document.querySelector('#landing-page .ripple-transition progress')).minWidth }, '<.2')
        .fromTo('#landing-page .ripple-transition h1', { opacity: 0 }, { duration: .5, opacity: 1 }, '>')
        .to('#landing-page .ripple-transition progress', { duration: 1.5, value: 100 }, '>')
        .set('#landing-page .biography', { display: 'none' }, '<')
        // .to(document.body, { '--scrollbar-color': themeColors.foreground }, '<')
        .to('#landing-page .ripple-transition', { duration: 1, opacity: 0, display: 'none' })
    */
    
    gsap.timeline({
        scrollTrigger: {
            trigger: '#landing-page',
            start: 0,
            end: "+=500",
            scrub: true,
            pin: true,
            invalidateOnRefresh: true
        }
    })
        .add(headerBgOut)
        .add(headerOut)
        .add(biographyIn)
    /*
        .to({}, {
            delay: 1,
            onStart: () => {
                stopScroll();
                loadProjects.play();
            },
            onReverseComplete: () => {
                stopScroll();
                loadProjects.reverse();
            }
        })
    */
});