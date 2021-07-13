import { LightningElement, track, api } from 'lwc';

export default class Wheel extends LightningElement {
    @track state = { position: 0 };
    @api letters;
    @api position;

    offset = 0;
    previousY = 0;

    dragging = false;

    addedListeners = false;
    wordlength;

    connectedCallback() {
        this.wordlength = this.letters.length;
    }

    get inlineStyle() {
        return `will-change: 'transform'; transition: transform ${
            Math.abs(this.offset) / 100 + 0.1
        }s;  transform: translateY(${this.state.position}px)`;
    }

    handleMouseMove(event) {
        if (this.dragging) {
            let clientY = event.touches
                ? event.touches[0].clientY
                : event.clientY;
            this.offset = clientY - this.previousY;

            let maxPosition = -this.wordlength * 80;
            let position = this.state.position + this.offset;

            this.state.position = Math.max(maxPosition, Math.min(80, position));

            this.previousY = clientY;
        }
    }

    handleMouseUp() {
        let maxPosition = -(this.wordlength - 1) * 80;
        let rounderPosition =
            Math.round((this.state.position + this.offset * 5) / 80) * 80;
        let finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));

        this.dragging = false;
        this.state.position = finalPosition;

        let finalIndex = -finalPosition / 80;
        if (finalIndex >= 0) {
            const event = new CustomEvent('letterselected', {
                detail: {
                    letter: this.letters[finalIndex],
                    position: this.position
                }
            });
            this.dispatchEvent(event);
        }
    }

    handleMouseDown(event) {
        this.previousY = event.touches
            ? event.touches[0].clientY
            : event.clientY;
        this.dragging = true;
    }

    /*componentDIDUPdate(){
        let selectedPosition = -(this.props.selected - 1) * 80
    
        if (!this.dragging && this.state.position !== selectedPosition) {
            this.setState({ position: selectedPosition })
        }
    }*/
}
