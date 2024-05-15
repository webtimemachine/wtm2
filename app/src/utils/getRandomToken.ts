/**
 * Generates a random token using the crypto API.
 * The generated token is a hexadecimal string with 256 bits of randomness.
 *
 * @returns {string}
 */
export const getRandomToken = (): string => {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  // Convert the random values to a hexadecimal string
  let hex = '';
  for (let i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
};
