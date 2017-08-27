import { Issue } from '../model/issue';
import { Comment } from '../model/comment';

export class DocumentParser {
    public static parseToIssue(document: Document): Issue {
        let issue = new Issue();

        // product
        issue.product = this.getProduct(document);

        // summary
        issue.summary = this.getSummary(document);

        // description
        issue.description = this.getDescription(document);

        // meta information
        issue.priority = this.getPriority(document);
        issue.version = this.getVersion(document);
        issue.component = this.getComponent(document);

        // comments
        issue.comments = this.getComments(document);

        // attachments
        issue.hasPatch = this.hasPatchAttachment(document);
        issue.hasScreenshot = this.hasScreenshotAttachment(document);
        console.log(issue.hasScreenshot);

        return issue;
    }

    private static getElement(document: Document, selectors: Array<string>): Element {
        let element: Element = null;
        selectors.find(selector => {
            element = document.querySelector(selector);
            return !!(element);
        });
        return element;
    }

    private static getElements(document: Document, selectors: Array<string>): NodeListOf<Element> {
        let nodes: NodeListOf<Element> = null;
        selectors.find(selector => {
            nodes = document.querySelectorAll(selector);
            return !!(nodes);
        });
        return nodes;
    }

    private static getTextContent(element: Element): string {
        if (element) return element.textContent.trim();
        return '';
    }

    private static getProduct(document: Document): string {
        let selectors = ['#project-name-val', '#field_container_product'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element);
    }

    private static getSummary(document: Document): string {
        let selectors = ['#summary-val', '#summary_container'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element);
    }

    private static getDescription(document: Document): string {
        let selectors = ['#description-val', '.bz_first_comment .bz_comment_text'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element);
    }

    private static getPriority(document: Document): string {
        let selectors = ['#priority-val'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element) || this.bzImportance(document);
    }

    private static getVersion(document: Document): string {
        let selectors = ['#versions-val', '#field_label_version + td'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element);
    }

    private static getComponent(document: Document): string {
        let selectors = ['#components-val', '#field_container_component'];
        let element = this.getElement(document, selectors);
        return this.getTextContent(element);
    }

    private static getComments(document: Document): Array<Comment> {
        let selectors = ['.activity-comment .action-body',
            'bz_comment_table .bz_comment:not(.bz_first_comment) .bz_comment_text'];
        let comments: Array<Comment> = [];
        let commentNodes = this.getElements(document, selectors);
        if (commentNodes) {
            for (let i = 0; i < commentNodes.length; i++) {
                let comment = new Comment();
                let element = commentNodes.item(i);
                comment.body = this.getTextContent(element);
                comments.push(comment);
            }
        }
        return comments;
    }

    private static hasPatchAttachment(document: Document): boolean {
        let selectors = ['.attachment-title'];
        let nodes = this.getElements(document, selectors);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes.item(i);
                let text = this.getTextContent(element);
                if (text.endsWith('.patch')) return true;
            }
        }
        selectors = ['.bz_patch'];
        let element = this.getElement(document, selectors);
        if (element) return true;
        return false;
    }

    private static hasScreenshotAttachment(document: Document): boolean {
        let selectors = ['.attachment-title'];
        let nodes = this.getElements(document, selectors);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes.item(i);
                let text = this.getTextContent(element).toLowerCase();
                if (text.endsWith('.png') || text.endsWith('.jpg')
                    || text.endsWith('.jpeg') || text.endsWith('.gif')) {
                        return true;
                }
            }
        }
        return false;
    }

    private static bzImportance(document: Document): string {
        let selectors = ['.field_label'];
        let nodes = this.getElements(document, selectors);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let element = nodes.item(i);
                let text = this.getTextContent(element).trim().toLowerCase();
                if (text.startsWith('importance')) {
                    let sibling = element.nextElementSibling;
                    return sibling.firstChild.textContent;
                }
            }
        }
        return '';
    }

}
