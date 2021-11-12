import { LightningElement, api, track } from 'lwc';

const TOTAL_SECONDS = 180;

export default class App extends LightningElement {
    @api gameObj;

    finalWord = [];

    @track foundWords = [];

    startTimestamp;
    endTimestamp;
    gameOver = false;
    player_id;
    playername;

    timeUp = false;
    countDown;

    totalSeconds = TOTAL_SECONDS;
    secondsLeft = TOTAL_SECONDS;

    score = 0;

    get duration(){
        if(this.startTimestamp && this.endTimestamp){
            return Math.floor((this.endTimestamp - this.startTimestamp)/1000);
        }
        return '';
    }

    get totalWords(){
        if(this.gameObj && this.gameObj.words){
            return (this.gameObj.words.length - this.foundWords.length) + ' words remaining, ' + this.playername;
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
            this.player_id = localStorage.getItem('player_id');
            this.playername = localStorage.getItem('player_name');
            this.countDown = setInterval(() => {
                this.secondsLeft--;
                if (this.secondsLeft === 0) {
                    this.timeUp = true;
                    clearInterval(this.countDown);
                    this.endGame();
                }
            }, 1000);
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
            this.score += 20;
            if(this.gameObj.words.length === this.foundWords.length){
                clearInterval(this.countDown);
                this.endGame();
            }
        } else {
            const element = event.target;
            element.classList.add('animate');
            setTimeout(() => {
                element.classList.remove('animate');
            }, 1000);
        }
    }

    endGame(){
        const d = new Date();
        this.endTimestamp = d.getTime();
        this.gameOver = true;
        this.score += this.secondsLeft;
        const updateScoreBody = {"player_id": this.player_id, "score": this.score};
        fetch('/api/savescore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateScoreBody)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }).catch((e) => {
                console.error(e);
            });
    }
}
