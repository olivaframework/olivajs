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

  private static openedEvent: Event = Http.createEvent('http-opened');
  private static sentEvent: Event = Http.createEvent('http-sent');
  private static loadingEvent: Event = Http.createEvent('http-loading');
  private static finishedEvent: Event = Http.createEvent('http-finished');

  constructor(config: HttpConfig) {
    this.xhr = new XMLHttpRequest();
    this.config = config;
  }

  private static createEvent(name: string): Event {
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

  private processRequest(method: string, callbacks: HttpCallbacks, data?: any) {
    this.xhr.open(method, this.config.url, true);

    if (this.config.headers) {
      for (let header of this.config.headers) {
        this.xhr.setRequestHeader(header.name, header.value);
      }
    }

    this.xhr.onreadystatechange = function () {
      if (this.readyState === 1) {
        document.dispatchEvent(Http.openedEvent);
      }

      if (this.readyState === 2) {
        document.dispatchEvent(Http.sentEvent);
      }

      if (this.readyState === 3) {
        document.dispatchEvent(Http.loadingEvent);
      }

      if (this.readyState === 4) {
        document.dispatchEvent(Http.finishedEvent);

        if (this.status === 200) {
          let responseType = this.getResponseHeader('Content-Type');
          let response = (responseType.indexOf('application/json') >= 0)
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

  public get(httpCallbacks: HttpCallbacks): void {
    this.processRequest('GET', httpCallbacks);
  }

  public post(data: any, httpCallbacks: HttpCallbacks): void {
    this.processRequest('POST', httpCallbacks, data);
  }

  public put(data: any, httpCallbacks: HttpCallbacks): void {
    this.processRequest('PUT', httpCallbacks, data);
  }

  public delete(httpCallbacks: HttpCallbacks): void {
    this.processRequest('DELETE', httpCallbacks);
  }
}

export { Http };
