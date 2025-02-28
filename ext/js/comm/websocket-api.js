/*
 * Copyright (C) 2025  Yomitan Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * This class controls communication with arbitrary websocket servers.
 */
export class WebSocketApi {
    /**
     * Creates a new instance.
     */
    constructor() {
        /** @type {boolean} */
        this._enabled = false;
        /** @type {?string} */
        this._serverUrl = null;
        /** @type {?WebSocket} */
        this._webSocket = null;
    }

    /**
     * Gets the URL of the WebSocket server.
     * @type {?string}
     */
    get serverUrl() {
        return this._serverUrl;
    }

    /**
     * Assigns the URL of the WebSocket server.
     * @param {string} value The new server URL to assign.
     */
    set serverUrl(value) {
        this._serverUrl = value;
    }

    /** */
    async connectWebsocket() {
        if (this._serverUrl !== null) {
            const webSocket = new WebSocket(this._serverUrl);
            console.log('created websocket');

            webSocket.addEventListener('message', this.receiveWebSocketMessage.bind(false));
            webSocket.addEventListener('open', (event) => {
                webSocket.send('Hello Server!');
            });

            this._webSocket = webSocket;
        }
    }

    /** */
    async sendWebSocketMessage() {}

    /**
     * @param messageEvent
     */
    async receiveWebSocketMessage(messageEvent) {
        console.log('received message');
        console.log(messageEvent);
    }
}
