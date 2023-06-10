document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.querySelector('#under-construction .text .countdown');
    const countdown_glitch = document.querySelector('#under-construction .text .glitch-container');

    const textScramble = new TextScramble(countdown, {
        classList: ['hover'],
        mark: {
            char: '\x0B',
            classList: ['mark'],
            classList_first: ['mark_first'],
            classList_last: ['mark_last']
        },
        mark_error: {
            char: '\x0C',
            classList: ['mark_error'],
            classList_first: [],
            classList_last: []
        }
    });

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

    let counter_fake_init = 10;
    let counter_fake_error = getRandomInt(-7, -4);

    let counter_fake = counter_fake_init;
    let counter_redirect = getRandomInt(1 , 5);

    const count = async () => {
        if (counter_fake < counter_fake_error) {
            countdown.classList.remove("mark")

            switch (counter_fake) {
                case counter_fake_error - 1:
                    await textScramble.setText('\x0C\x0Berrrr\x00');
                    countdown_glitch.classList.remove("glitch");
                    break;
                case counter_fake_error - 2:
                    await textScramble.setText('\x0C\x0Berror\x00');
                    break;
                default:
                    await textScramble.setText(`\x0B${counter_fake_init} secs\x00`);
                    counter_fake = counter_fake_init + 1;
                    counter_redirect--;
            }

            setTimeout(count, 2000);
        } else {
            countdown.classList.add("mark")

            if (counter_fake < -1) {
                countdown_glitch.classList.add("glitch");
                countdown.innerText = getRandomInt(-9, -1) + " sec";
            } else if (counter_fake >= -1 && counter_fake <= 1) {
                countdown.innerText = counter_fake + " sec";
            } else {
                countdown.innerText = counter_fake + " secs";
            }

            countdown.dataset.text = countdown.innerText;

            if (counter_fake <= 0 && counter_redirect <= 0) {
                window.location.assign("https://github.com/hampoelz");
            } else {
                setTimeout(count, 1000);
            }
        }

        counter_fake--;
    };
    count();
});