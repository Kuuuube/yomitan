/*
 * Copyright (C) 2020  Alex Yatskov <alex@foosoft.net>
 * Author: Alex Yatskov <alex@foosoft.net>
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

/* global
 * jp
 */

class ClipboardMonitor extends EventDispatcher {
    constructor({getClipboard}) {
        super();
        this._timerId = null;
        this._timerToken = null;
        this._interval = 250;
        this._previousText = null;
        this._getClipboard = getClipboard;
    }

    start() {
        this.stop();

        // The token below is used as a unique identifier to ensure that a new clipboard monitor
        // hasn't been started during the await call. The check below the await this._getClipboard()
        // call will exit early if the reference has changed.
        const token = {};
        const intervalCallback = async () => {
            this._timerId = null;

            let text = null;
            try {
                text = await this._getClipboard();
            } catch (e) {
                // NOP
            }
            if (this._timerToken !== token) { return; }

            if (
                typeof text === 'string' &&
                (text = text.trim()).length > 0 &&
                text !== this._previousText
            ) {
                this._previousText = text;
                if (jp.isStringPartiallyJapanese(text)) {
                    this.trigger('change', {text});
                }
            }

            this._timerId = setTimeout(intervalCallback, this._interval);
        };

        this._timerToken = token;

        intervalCallback();
    }

    stop() {
        this._timerToken = null;
        if (this._timerId !== null) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
    }

    setPreviousText(text) {
        this._previousText = text;
    }
}
