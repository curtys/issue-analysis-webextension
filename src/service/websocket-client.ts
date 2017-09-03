import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Protocol, WSEvent } from '../model/protocol';

@inject(EventAggregator)
export class WebsocketClient {

    public error: Error;
    public connected: boolean = false;
    private ea: EventAggregator;
    private endpoint: WebSocket;

    private errorConnection: string = 'Could not connect to server.';

    public constructor(ea: EventAggregator) {
        this.ea = ea;
    }

    public disconnect(): void {
        this.endpoint.close();
    }

    public send(message: Protocol): void {
        this.endpoint.send(JSON.stringify(message));
    }

    public connect(url: string, protocols?: string | string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.endpoint = new WebSocket(url);
            this.endpoint.onerror = errorEvent => {
                this.error = new Error(this.errorConnection);
                reject(this.error);
            };
            this.endpoint.onopen = event => {
                this.connected = true;
                resolve();
            };
            this.endpoint.onclose = event => {
                this.connected = false;
                this.handleClosedConnection(event);
            };
            this.endpoint.onmessage = event => this.handleMessage(event.data);
        });
    }

    private handleMessage(message: any) {
        let protocol: Protocol = JSON.parse(message);
        if (protocol.event === WSEvent.RESULT) {
            this.ea.publish('wsresult', protocol.payload);
        }

    }

    private handleClosedConnection(event: CloseEvent) {
        if (this.connected) {
            this.ea.publish('wsclose', event.eventPhase);
        }
    }

}
