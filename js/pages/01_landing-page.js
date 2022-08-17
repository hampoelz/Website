document.addEventListener('DOMContentLoaded', () => {
    const titles = [
        'Rene \x0BHAMPÖLZ\x00',
        'When it does not\nexist \x0B#DESIGN\x00 it',
        'When it does not\nexist \x0B#CREATE\x00 it'
    ];

    /*
    const startScroll = () => scroll.start();
    const stopScroll = () => {
        scroll.stop();
        scroll.scrollTo(scroll.scroll.instance.scroll.y, { duration: 1 });
    }
    */

    const headerTitle = document.querySelector('#landing-page .header .title');
    const headerBackground = document.querySelectorAll("#landing-page .header .bg-container");

    const biographyPicture = document.querySelector("#landing-page .biography .profile .picture-container");
    const biographyPictureRipple = document.querySelector("#landing-page .biography .profile .picture-ripple");

    const textScramble = new TextScramble(headerTitle, {
        classList: ['hover'],
        mark: {
            char: '\x0B',
            classList: ['mark', 'move_down', 'move_down-500'],
            classList_first: ['mark_first'],
            classList_last: ['mark_last']
        }
    });
    
    new MouseParallax([headerBackground]);
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

    // TODO: separate background code to it's own class

    const biographyBackgroundContainer = document.querySelector("#landing-page .biography .bg-container")
    const biographyBackground = new PIXI.Application({
        resizeTo: biographyBackgroundContainer,
        backgroundAlpha: 0
    });

    biographyBackgroundContainer.appendChild(biographyBackground.view);

    function decToHex(number) {
        const hex = number.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(string) {
        const rgb = string.split(',');
        const r = Number(rgb[0]);
        const g = Number(rgb[1]);
        const b = Number(rgb[2]);

        return '0x' + decToHex(r) + decToHex(g) + decToHex(b);
    }

    const itemConfig = {
        getColor: () => rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--foreground-rgb')),
        size: {
            min: 10,
            max: 200
        },
        borderRadius: 4,
        rotationSpeed: 0.01,
        movementSpeed: {
            min: 0.2,
            max: 0.8
        }
    }

    const canvasSize = { width: 0, height: 0 }

    let biographyBackgroundItems = [];

    function createItem(positionX, offsetY, size, borderRadius, color, alpha, movementSpeed, rotationSpeed) {
        const rect = new PIXI.Graphics();
        rect.beginFill(0xFFFFFF, alpha);
        rect.drawRoundedRect(0, 0, size, size, borderRadius);
        rect.position.set(size / 2, size / 2);
        rect.pivot.set(size / 2, size / 2);

        rect.tint = color;

        biographyBackground.stage.addChild(rect);

        biographyBackgroundItems.push({ positionX, offsetY, movementSpeed, rotationSpeed, rect });

        rect.position.set(positionX, canvasSize.height + size + offsetY);
    }

    const getRandomDouble = (min, max) => Math.random() * (max - min) + min;

    function generateItem(maxTries) {
        const offsetY = getRandomDouble(0, canvasSize.height / 10);
        const alpha = getRandomDouble(0, 1);
        const movementSpeed = getRandomDouble(itemConfig.movementSpeed.min, itemConfig.movementSpeed.max);

        function generateDimensions(minSize, maxSize) {
            const size = getRandomDouble(minSize, maxSize);
            const positionX = getRandomDouble(2 / 3 * size, canvasSize.width - 2 / 3 * size);
            return { positionX, size };
        }

        let dimensions = generateDimensions(itemConfig.size.min, itemConfig.size.max);
        
        function isHorizontalCollision(position, width) {
            for (let i = 0; i < biographyBackgroundItems.length; i++) {
                const item = biographyBackgroundItems[i];
                if (item.positionX + item.rect.width >= position - width &&
                    item.positionX - item.rect.width <= position + width) {
                    return true;
                }
            }

            return false;
        }

        const sizeSubtractionSteps = (itemConfig.size.max - itemConfig.size.min) / maxTries;

        for (let i = 0; i <= maxTries; i++) {
            if (!isHorizontalCollision(dimensions.positionX, dimensions.size)) {
                createItem(dimensions.positionX, offsetY, dimensions.size, itemConfig.borderRadius, itemConfig.getColor(), alpha, movementSpeed, itemConfig.rotationSpeed);
                break;
            }

            const sizeSubtraction = sizeSubtractionSteps * i;
            dimensions = generateDimensions(itemConfig.size.min, itemConfig.size.max - sizeSubtraction);
        }
    }

    function fillBackground() {
        const itemCount = Math.round(canvasSize.width / itemConfig.size.max);

        if (biographyBackgroundItems.length == itemCount) return;

        while (biographyBackgroundItems.length < itemCount) {
            generateItem(itemCount * 10);
        }

        while (biographyBackgroundItems.length > itemCount) {
            const itemPosition = Math.max(...biographyBackgroundItems.map(item => item.positionX));
            const itemIndex = biographyBackgroundItems.findIndex(item => item.positionX == itemPosition);
            biographyBackgroundItems[itemIndex].rect.destroy();
            biographyBackgroundItems.splice(itemIndex, 1);
        }
    }

    biographyBackground.renderer.on('resize', (width, height) => {
        if (height != canvasSize.height) {
            const heightDiff = height - canvasSize.height ?? 0;
            canvasSize.height = height;

            biographyBackgroundItems.forEach(item => {
                item.rect.position.y += heightDiff;
            });
        }

        if (width != canvasSize.width) {
            canvasSize.width = width;
        }

        if (width == canvasSize.width && height == canvasSize.height) {
            // possible theme change - update colors
            
            biographyBackgroundItems.forEach(item => {
                item.rect.tint = itemConfig.getColor();
            })
        }
    });

    biographyBackground.ticker.add(() => {
        if (canvasSize.height == 0 || canvasSize.width == 0) return;
            
        biographyBackgroundItems = biographyBackgroundItems.filter(item => {
            if (item.rect.position.y + item.rect.height < 0) {
                item.rect.destroy();
                return false;
            }
            return true;
        });

        biographyBackgroundItems.forEach(item => {
            item.rect.position.y -= item.movementSpeed;
            item.rect.rotation += item.rotationSpeed;
        });

        fillBackground();
    });

    let headerBgOut = gsap.timeline()
        .to(document.documentElement, {
            '--header-background-rgb': () => `rgb(${getCssVariable('--background-rgb')})`,
            '--header-foreground-rgb': () => `rgb(${getCssVariable('--foreground-rgb')})`,
            
        })
        .fromTo(document.documentElement,
            { '--cursor-color': () => `rgb(${getCssVariable('--accent-2-rgb')})` },
            { '--cursor-color': () => `rgb(${getCssVariable('--accent-1-rgb')})` }, '<')
        .to('#landing-page', { backgroundColor: () => `rgb(${getCssVariable('--background-rgb')})` }, '<')
        .to('#landing-page .header .bg-grid .bg-item', { rotation: 40, opacity: 0 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(1)', { xPercent: -100, yPercent: -100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(4)', { xPercent: 100, yPercent: -100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(2)', { xPercent: -100, yPercent: 100 }, '<')
        .to('#landing-page .header .bg-grid .bg-item:nth-child(3)', { xPercent: 100, yPercent: 100 }, '<');

    let headerOut = gsap.timeline()
        .to('#landing-page .header .title', { yPercent: 20, opacity: 0 })
        .set('#landing-page .header', { display: 'none' });
    
    let biographyIn = gsap.timeline({
        onComplete: () => {
            biographyBackground.resize();
        }
    })
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