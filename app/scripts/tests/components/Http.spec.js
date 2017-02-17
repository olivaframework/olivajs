import {Http} from '../../components/Http';

describe('Http component specification', () => {
  let requests = [];
  let xhr;

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = request => {
      requests.push(request);
    };
  });

  it('Should get data on successful request', done => {
    let data = { foo: 'bar' };
    let dataJson = JSON.stringify(data);
    let request = new Http({ url: '/testData' });

    request.get({
      failure: null,
      success: function (success) {
        success.should.deep.equal(dataJson);
        done();
      }
    });

    requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
  });

  it('Should parse response when getting application/json content', done => {
    let data = { foo: 'bar' };
    let dataJson = JSON.stringify(data);
    let request = new Http({ url: '/testData' });

    request.get({
      failure: null,
      success: function (success) {
        success.should.deep.equal(data);
        done();
      }
    });

    requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
  });

  it('Should get error on failing request', done => {
    let request = new Http({ url: '/testError' });

    request.get({
      failure: function (error) {
        expect(error).to.exist;
        done();
      },
      success: null
    });

    requests[0].respond(404);
  });

  it('Should run success callback on successful request', done => {
    let request = new Http({ url: '/testCallback' });
    let successFn = sinon.spy();
    let errorFn = sinon.spy();

    request.get({
      failure: errorFn,
      success: successFn
    });

    requests[0].respond(200, { 'Content-Type': 'text/json' }, 'foobar');

    assert.isTrue(successFn.called, 'Success callback has been called');
    assert.isTrue(errorFn.notCalled, 'Error callback has not been called');
    done();
  });

  it('Should run failure callback on failing request', done => {
    let request = new Http({ url: '/testErrorCallback' });
    let successFn = sinon.spy();
    let errorFn = sinon.spy();

    request.get({
      failure: errorFn,
      success: successFn
    });

    requests[0].respond(500);

    assert.isTrue(successFn.notCalled, 'Success callback has been called');
    assert.isTrue(errorFn.called, 'Error callback has not been called');
    done();
  });

  it('Should set the headers when provided', done => {
    let request = new Http({
      headers: [{
        name: 'X-Foo',
        value: 'Bar'
      }, {
        name: 'X-Token',
        value: '978uohjknrw3v'
      }],
      url: '/testHeaders'
    });

    request.get({
      failure: null,
      success: null
    });

    requests[0].requestHeaders.should.deep.equal({
      'X-Foo': 'Bar',
      'X-Token': '978uohjknrw3v'
    });

    done();
  });

  it('Should send data and make a POST on post', done => {
    let request = new Http({ url: '/testPost' });
    let data = { foo: 'bar'};
    let callbacks = {
      failure: null,
      success: null
    };

    request.post(data, callbacks);
    expect(requests[0].method).to.equal('POST');
    expect(requests[0].requestBody).to.equal(JSON.stringify(data));
    done();
  });

  it('Should make a PUT on put', done => {
    let request = new Http({ url: '/testPut' });
    let data = { foo: 'bar'};
    let callbacks = {
      failure: null,
      success: null
    };

    request.put(data, callbacks);
    expect(requests[0].method).to.equal('PUT');
    expect(requests[0].requestBody).to.equal(JSON.stringify(data));
    done();
  });

  it('Should make a DELETE on delete', done => {
    let request = new Http({ url: '/testDelete' });
    let callbacks = {
      failure: null,
      success: null
    };

    request.delete(callbacks);
    expect(requests[0].method).to.equal('DELETE');
    done();
  });

  afterEach(() => {
    requests = [];
    xhr.restore();
  });
});
