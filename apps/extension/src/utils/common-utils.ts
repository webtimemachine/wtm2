/**
 * Extracts the search parameters from the window object and returns them as a key-value dictionary.
 * @returns An object with the search parameters as keys and their corresponding values.
 */
export const getSearchParams = (): Record<string, string> => {
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};
