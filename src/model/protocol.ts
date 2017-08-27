export const enum WSEvent {
    DOES_NOT_UNDERSTAND,
    RESULT,
    REQUEST
}

export class Protocol {
    public event: WSEvent;
    public payload: string;

    constructor(event?: WSEvent, payload?: string) {
        this.event = event;
        this.payload = payload;
        if (payload) this.event = WSEvent.REQUEST;
    }
}