class TextScramble {
    constructor(textElement) {
        this.element = textElement;
        this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.specials = {
            reset: '\x00',
            bold: '\x0B',
            newline: '\n'
        }
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);

        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();

        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        let specials = {
            bold: false
        };

        for (let i = 0, n = this.queue.length; i < n; i++) {
            const charElement = document.createElement('span');
            let { from, to, start, end, char } = this.queue[i];

            if (to == this.specials.newline) output += '<br>';
            else if (to == this.specials.bold) specials.bold = true;
            else if (to == this.specials.reset)
                Object.keys(specials).forEach(v => specials[v] = false)

            if (Object.values(this.specials).includes(to)) {
                complete++;
                continue;
            }

            charElement.classList.add('hover');
            if (specials.bold) charElement.classList.add('clickable', 'bold');

            if (this.frame >= end) {
                complete++;
                charElement.innerHTML = to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                charElement.classList.add('scramble');
                charElement.innerHTML = char;
            } else charElement.innerHTML = from;

            output += charElement.outerHTML;
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        'Rene \x0BHAMPÖLZ\x00',
        'When it does not\nexist \x0B#CREATE\x00 it',
        'When it does not\nexist \x0B#DESIGN\x00 it',
    ];

    const header = document.querySelector('#landing-page .header .title');
    const textScramble = new TextScramble(header);

    let counter = 0;
    const next = () => {
        textScramble.setText(phrases[counter]).then(() => {
            setTimeout(next, 1500);
        });
        counter = counter == 2 ? 1 : counter + 1;
    };
    next();
});