import { LightningElement, api, track } from 'lwc';

export default class App extends LightningElement {
    @api gameObj;

    finalWord = [];

    @track foundWords = [];

    startTimestamp;
    endTimestamp;
    gameOver = false;

    get duration(){
        if(this.startTimestamp && this.endTimestamp){
            return Math.floor((this.endTimestamp - this.startTimestamp)/1000);
        }
        return '';
    }

    connectedCallback() {
        if (this.gameObj && this.gameObj.letterGroups) {
            this.gameObj.letterGroups.forEach((element) => {
                this.finalWord.push(element.letters[0]);
            });
            const d = new Date();
            this.startTimestamp = d.getTime();
        }
    }

    handleSelectedLetter(event) {
        const letter = event.detail.letter;
        const position = event.detail.position;
        this.finalWord[position] = letter;
    }

    validateWord(event) {
        const word = this.finalWord.join('');
        if (this.gameObj.words.includes(word) && !this.foundWords.includes(word)) {
            this.foundWords.push(word);
            if(this.gameObj.words.length === this.foundWords.length){
                const d = new Date();
                this.endTimestamp = d.getTime();
                this.gameOver = true;
            }
        } else {
            const element = event.target;
            element.classList.add('animate');
            setTimeout(() => {
                element.classList.remove('animate');
            }, 1000);
        }
    }
}
