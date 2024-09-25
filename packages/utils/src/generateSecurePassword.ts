export function generateSecurePassword(length = 12) {
  if (length < 3) {
    throw new Error(
      'Password length must be at least 3 to include required character types.',
    );
  }

  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?,./';

  const allChars = lowerCase + upperCase + digits + symbols;
  let passwordArray = [];

  // Ensure at least one character from each required set is included
  passwordArray.push(getRandomChar(lowerCase));
  passwordArray.push(getRandomChar(upperCase));
  passwordArray.push(getRandomChar(digits));
  passwordArray.push(getRandomChar(symbols));

  // Fill the rest of the password with random characters from all character sets
  for (let i = 3; i < length; i++) {
    passwordArray.push(getRandomChar(allChars));
  }

  // Shuffle the password array to ensure randomness
  passwordArray = shuffleArray(passwordArray);

  // Convert array to string
  return passwordArray.join('');
}

function getRandomChar(charset: string) {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  const index = randomValues[0] % charset.length;
  return charset.charAt(index);
}

function shuffleArray(array: string[]) {
  const shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const j = randomValues[0] % (i + 1);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}
