import { Comment } from './comment';

export class Issue {
    comments: Array<Comment> = [];
    component: string = '';
    description: string = '';
    hasPatch: boolean;
    hasScreenshot: boolean;
    id: string = '';
    priority: string = '';
    product: string = '';
    project: string = '';
    summary: string = '';
    systemSpecification: string = '';
    version: string = '';

    public isValid(): boolean {
        return !!(this.description);
    }
}