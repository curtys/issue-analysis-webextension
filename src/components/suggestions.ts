import { bindable } from 'aurelia-framework';

export class Suggestions {
    @bindable public improvements: Array<String> = [];
}
