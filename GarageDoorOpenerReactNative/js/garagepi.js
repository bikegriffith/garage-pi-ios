import base64 from 'react-native-base64'
import  { BASE_URL, USERNAME, PASSWORD } from '../config';


function base64Encode(str) {
  return base64.encode(str);
}


export default class GaragePi {
  constructor() {
    this.pollingStarted = 0;
    this.pollingBackoffIndex = 0;
    this.pollHandle = null;
    this.lastUpdateTS = 0;
    this.status = null;
    this.door = {};
    this.listeners = [];
  }

  toggleButton(id) {
    return fetch(`${BASE_URL}/clk?id=${id}`, this._headers)
  }

  connect(listener = null) {
    if (listener) {
      this.listeners.push(listener);
    }

    if (this.pollingStarted > 0) {
      return;
    }

    clearTimeout(this.pollHandle);
    this.pollingStarted = Date.now();

    this.status = (this.status == 'connected' ? 'connected' : 'connecting');
    this._notifyListeners();

    var delay = this.status == 'connected' ? 0 : 1000;

    setTimeout(() => {
      fetch(`${BASE_URL}/upd?lastupdate=${this.lastUpdateTS}`, this._headers)
        .then((r) => {
          this.pollingStarted = 0;
          return r.json()
        })
        .then((data) => {
          var door = data.update[0] || [null, null, 0];
          this.lastUpdateTS = data.timestamp;
          this.status = 'connected';
          this.door = {
            id: door[0],
            state: door[1],
            lastUpdateTS: door[2] * 1000,
          };
          this._notifyListeners();
          clearTimeout(this.pollHandle);
          this.pollHandle = setTimeout(() => this.connect(), 1000);
          this.pollingBackoffIndex = 0;
        })
        .catch((err) => {
          if ((Date.now() - this.pollingStarted) / 1000 > 15) {
            // Last long-polling request was in-flight for over 15 seconds, so probably not a *real*
            // error, just timeout and needs reconnected
            this.pollingStarted = 0;
            clearTimeout(this.pollHandle);
            this.pollHandle = setTimeout(() => this.connect(), 0);
          } else {
            this.pollingBackoffIndex++;
            this.pollingStarted = 0;
            this.lastUpdateTS = 0;
            this.status = 'connection error';
            this._notifyListeners();
            clearTimeout(this.pollHandle);
            this.pollHandle = setTimeout(() => this.connect(), Math.min(15000, this.pollingBackoffIndex * 1000));
          }
        });
    }, delay);
  }

  _notifyListeners() {
    setTimeout(() => {
      this.listeners.forEach((l) => l(this));
    }, 0);
  }

  get _headers() {
    var headers = new Headers();
    headers.append("Authorization", "Basic " + base64Encode(`${USERNAME}:${PASSWORD}`));
    return {headers: headers};
  }
}
