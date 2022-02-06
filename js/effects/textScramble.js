class TextScramble {
    constructor(textElement, specials) {
        this.element = textElement;
        this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.specials = Object.assign({
            newline: '\n',
            reset: '\x00'
        }, specials)
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

        let specialsList = {};

        loop:
        for (let i = 0, n = this.queue.length; i < n; i++) {
            const charElement = document.createElement('span');
            let { from, to, start, end, char } = this.queue[i];

            for (let key of Object.keys(this.specials)) {
                let value = this.specials[key];

                if (value && (to == value || to == value.char)) {
                    if (key == 'newline') output += '<br>';
                    else if (key == 'reset') Object.keys(specialsList).forEach(key => specialsList[key] = false);
                    else specialsList[key] = true;

                    complete++;
                    continue loop;
                } else if (key == 'classList') charElement.classList.add(...value);
            }

            for (let key of Object.keys(specialsList))
                if (specialsList[key]) charElement.classList.add(...this.specials[key].classList);

            if (this.frame >= end) {
                complete++;
                charElement.innerHTML = to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                charElement.classList.add('scramble');
                charElement.innerHTML = char;
            } else charElement.innerHTML = from;

            output += charElement.outerHTML;
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) this.resolve();
        else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}