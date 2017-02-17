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

  constructor(config: HttpConfig) {
    this.xhr = new XMLHttpRequest();
    this.config = config;
  }

  private processRequest(method: string, callbacks: HttpCallbacks, data?: any) {
    this.xhr.open(method, this.config.url, true);

    if (this.config.headers) {
      for (let header of this.config.headers) {
        this.xhr.setRequestHeader(header.name, header.value);
      }
    }

    this.xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
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
