import { WebsocketClient } from './service/websocket-client';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Issue } from './model/issue';
import { inject } from 'aurelia-dependency-injection';
import { Protocol } from './model/protocol';
import { Result } from './model/result';
import { DocumentParser } from './service/document-parser';

@inject(EventAggregator)
export class App {
    public status = '';
    public result: Result;
    private ea: EventAggregator;
    private subscriptions: Array<Subscription> = [];
    private websocket: WebsocketClient;
    private serverUrl: string = 'ws://issueanalysis.azurewebsites.net/service';
    private subject: Document;
    private issue: Issue;
    private isBug: boolean = false;
    private waiting: boolean = true;

    private errorConnectionClosed: string = 'Connection was closed by the server.';
    private errorConnection: string = 'Could not connect to server.';
    private errorUrl: string = 'Invalid service url.';
    private errorParsing: string = 'Failed to read page.';
    private errorUnsupported: string = 'Unsupported page. No Issue information found.';

    public constructor(ea: EventAggregator) {
        this.ea = ea;
        this.websocket = new WebsocketClient(ea);
    }

    private attached(): void {
        this.subscriptions.push(this.ea.subscribe('wsresult', response => this.handleResult(response)));
        this.subscriptions.push(this.ea.subscribeOnce('wsclose', response => {
            if (!this.result) {
                this.error(this.errorConnectionClosed);
            }
        }));

        let subjectPageXML = window['subjectPageXML'];
        if (subjectPageXML) {
            this.subject = this.parseToDom(subjectPageXML);
            this.issue = DocumentParser.parseToIssue(this.subject);
            if (!this.issue.isValid()) {
                this.error(this.errorUnsupported);
                return;
            }
        } else {
            this.error(this.errorParsing);
            return;
        }

        let promise: Promise<any> = window['serverUrlPromise'];
        if (promise) {
            promise.then(p => {
                this.serverUrl = p.wsurl;
                if (this.checkServiceUrl(this.serverUrl)) {
                    this.initConnection();
                } else {
                    this.error(this.errorUrl);
                }
            });
        } else {
            console.warn('Could not retrieve service url from settings. Using default.');
            this.initConnection();
        }
    }

    private detached(): void {
        this.subscriptions.forEach(s => s.dispose());
    }

    private send(): void {
        if (this.issue && this.issue.isValid() && this.websocket.connected) {
            this.enableSpinner();
            let isStr = JSON.stringify(this.issue);
            let protocol = new Protocol(undefined, isStr);
            this.websocket.send(protocol);
        } else {
            this.error(this.errorConnection);
        }
    }

    private handleResult(data: any): void {
        let result: Result = JSON.parse(data);
        this.status = '';
        this.result = result;
        this.isBug = 'BUG' === result.issueType;
        this.waiting = false;
    }

    private initConnection(): void {
        this.websocket.connect(this.serverUrl).then(p => {
            this.send();
        }).catch(reason => this.error(reason.message));
    }

    private parseToDom(xmlString: string): Document {
        let parser = new DOMParser();
        return parser.parseFromString(xmlString, 'text/html');
    }

    private enableSpinner(): void {
        this.waiting = true;
        this.status = '';
    }

    private checkServiceUrl(url: string): boolean {
        if (!url) return false;
        return url.startsWith('ws://');
    }

    private error(errorStr: string): void {
        this.waiting = false;
        this.status = errorStr;
    }

}
