interface HttpHeader {
  name: string;
  value: string;
}

interface HttpConfig {
  url: string;
  headers?: Array<HttpHeader>
}

interface HttpCallbacks {
  failure: (error) => any;
  success: (data) => any;
}

class Http {
  private xhr: XMLHttpRequest;
  private config: HttpConfig;

  private openedEvent: Event;
  private sentEvent: Event;
  private loadingEvent: Event;
  private finishedEvent: Event;

  constructor(config: HttpConfig) {
    this.xhr = new XMLHttpRequest();
    this.config = config;
    this.openedEvent = this.createEvent('http-opened');
    this.sentEvent = this.createEvent('http-sent');
    this.loadingEvent = this.createEvent('http-loading');
    this.finishedEvent = this.createEvent('http-finished');
  }

  private createEvent(name: string): Event {
    let event: Event;

    try {
      event = new CustomEvent(name, {
        bubbles: true,
        cancelable: true
      });
    } catch (e) {
      event = document.createEvent('Event');
      event.initEvent(name, true, true);
    }

    return event;
  }

  private processRequest(
    method: string,
    callbacks: HttpCallbacks,
    data?: any): void {
    this.xhr.open(method, this.config.url, true);

    if (this.config.headers) {
      for (const header of this.config.headers) {
        this.xhr.setRequestHeader(header.name, header.value);
      }
    }

    const self = this;

    this.xhr.onreadystatechange = function () {
      if (this.readyState === 1) {
        document.dispatchEvent(self.openedEvent);
      }

      if (this.readyState === 2) {
        document.dispatchEvent(self.sentEvent);
      }

      if (this.readyState === 3) {
        document.dispatchEvent(self.loadingEvent);
      }

      if (this.readyState === 4) {
        document.dispatchEvent(self.finishedEvent);

        if (this.status === 200) {
          const responseType = this.getResponseHeader('Content-Type');
          const response = (responseType.indexOf('application/json') >= 0)
            ? JSON.parse(this.responseText)
            : this.responseText;

          callbacks.success(response);
        } else {
          callbacks.failure(this);
        }
      }
    };

    this.xhr.send(JSON.stringify(data));
  }

  private get(httpCallbacks: HttpCallbacks): void {
    this.processRequest('GET', httpCallbacks);
  }

  private post(data: any, httpCallbacks: HttpCallbacks): void {
    this.processRequest('POST', httpCallbacks, data);
  }

  private put(data: any, httpCallbacks: HttpCallbacks): void {
    this.processRequest('PUT', httpCallbacks, data);
  }

  private delete(httpCallbacks: HttpCallbacks): void {
    this.processRequest('DELETE', httpCallbacks);
  }
}

export { Http };
