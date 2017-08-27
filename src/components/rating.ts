import { bindable } from 'aurelia-framework';
import { Star } from './star';

export class Rating {
    @bindable public score: number = 0;
    @bindable public max: number = 5;
    private stars: Array<Star> = [];

    public scoreChanged() {
        this.stars = [];
        for (let i = 0; i < this.max; i++) {
            let star = new Star();
            star.full = (i < this.score);
            this.stars.push(star);
        }
    }
}
