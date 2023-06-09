document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.querySelector('#under-construction .text .countdown');

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

    let counter_fake_init = 10;
    let counter_fake_error = -1;

    let counter_fake = counter_fake_init;
    let counter_redirect = Math.floor(Math.random() * 5);
    console.log(counter_redirect);

    const count = async () => {
        if (counter_fake < counter_fake_error) {
            countdown.classList.remove("mark")

            if (counter_fake == counter_fake_error - 1) {
                await textScramble.setText('\x0B0 sec\x00',);
            } else if (counter_fake <= counter_fake_error - 4) {
                await textScramble.setText(`\x0B${counter_fake_init} secs\x00`);
                counter_fake = counter_fake_init + 1;
                counter_redirect--;
            } else {
                await textScramble.setText('\x0C\x0Berror\x00');
            }

            setTimeout(count, 2000);
        } else {
            countdown.classList.add("mark")

            if (counter_fake <= 1) {
                countdown.innerText = counter_fake + " sec";
            } else {
                countdown.innerText = counter_fake + " secs";
            }
            
            console.log(counter_redirect);
            if (counter_fake <= 0 && counter_redirect <= -1) {
                window.location.href = "https://github.com/hampoelz";
            } else {
                setTimeout(count, 1000);
            }
        }

        counter_fake--;
    };
    count();
});