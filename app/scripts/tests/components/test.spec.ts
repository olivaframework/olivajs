import { expect } from 'chai';
import { Test } from '../../components/test';

describe('should ... testing...', () => {
  const test = new Test('hello');

  it('test sendMessage', () => {
    const message = test.sendMessage();

    expect(message).to.be.equals('hello world');
  });
});
