class Http {
  private xhr: XMLHttpRequest;

  constructor() {
    this.xhr = new XMLHttpRequest();
  }

  public get(url: string, onSuccess: (data) => any, onFailure: (error) => any) {
    this.xhr.open('GET', url, true);

    this.xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          let responseType = this.getResponseHeader('Content-Type');
          let response = (responseType.indexOf('application/json') >= 0)
            ? JSON.parse(this.responseText)
            : this.responseText;

          onSuccess(response);
        } else {
          onFailure(this);
        }
      }
    };

    this.xhr.send(null);
  }
}

export { Http };
