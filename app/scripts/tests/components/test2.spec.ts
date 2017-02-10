import { expect } from 'chai';
import { Test2 } from '../../components/test2';

describe('Testing Test2 class', () => {
  const test2 = new Test2(1, 3);

  it('Testing sum function', () => {
    expect(test2.sum()).to.be.equals(4);
  });
});
