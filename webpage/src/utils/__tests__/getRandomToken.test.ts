import { getRandomToken } from '../getRandomToken';

describe('getRandomToken', () => {
  it('should generate a token consisting of hexadecimal characters', () => {
    const token = getRandomToken();
    const hexadecimalRegex = /^[0-9a-fA-F]+$/;
    expect(hexadecimalRegex.test(token)).toBe(true);
  });

  it('should generate a unique token each time it is called', () => {
    const token1 = getRandomToken();
    const token2 = getRandomToken();
    expect(token1).not.toEqual(token2);
  });
});
