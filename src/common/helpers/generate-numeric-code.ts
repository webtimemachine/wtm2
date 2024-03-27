export function generateNumericCode(digits = 6): string {
  const numbers: number[] = [];
  for (let i = 0; i < digits; i++) {
    numbers.push(Math.trunc(Math.random() * 10));
  }
  return numbers.join('');
}
