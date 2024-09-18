import { last } from '../last';

describe('last', () => {
  it('should return the last element of a non-empty array', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(last(arr)).toEqual(5);
  });

  it('should return undefined for an empty array', () => {
    const arr: number[] = [];
    expect(last(arr)).toBeUndefined();
  });

  it('should return the last element of an array with a single element', () => {
    const arr = [42];
    expect(last(arr)).toEqual(42);
  });
});
