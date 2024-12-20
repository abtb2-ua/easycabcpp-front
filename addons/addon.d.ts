type Log = {
    code: number,
    timestamp: string,
    message: string,
}

type Message = {
    code: number,
    taxiId: number,
    id: string,
    coord: Coordinate,
}

type Coordinate = {
    x: number,
    y: number,
}

type Location = {
    id: string,
    coord: Coordinate,
}

type Customer = {
    coord: Coordinate,
    id: string,
    location: string,
    onboard: boolean,
    inQueue: boolean,
    nextRequest: number,
}

type Taxi = {
    coord: Coordinate,
    dest: Coordinate,
    id: number,
    customer: string,
    connected: boolean,
    ready: boolean,
    stopped: boolean,
    waitTime: number,
}

type Map = {
    locations: Location[],
    customers: Customer[],
    taxis: Taxi[],
}

export function serializeMessage(message: Message): Buffer;

export function deserializeLog(buffer: Buffer): Log;
export function deserializeMap(buffer: Buffer): Map;

export function getMessageCodes(): number[];
export function getWarningCodes(): number[];
export function getErrorCodes(): number[];