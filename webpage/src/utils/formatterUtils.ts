const letterToColorMap: { [key: string]: string } = {
  a: 'bg-yellow-400',
  b: 'bg-blue-300',
  c: 'bg-green-300',
  d: 'bg-pink-300',
  e: 'bg-red-300',
  f: 'bg-indigo-300',
  g: 'bg-teal-300',
  h: 'bg-orange-300',
  i: 'bg-cyan-300',
  j: 'bg-lime-300',
  k: 'bg-amber-300',
  l: 'bg-emerald-300',
  m: 'bg-fuchsia-300',
  n: 'bg-rose-300',
  o: 'bg-sky-300',
  p: 'bg-violet-300',
  q: 'bg-yellow-500',
  r: 'bg-blue-500',
  s: 'bg-green-500',
  t: 'bg-pink-500',
  u: 'bg-red-500',
  v: 'bg-indigo-500',
  w: 'bg-teal-500',
  x: 'bg-orange-500',
  y: 'bg-cyan-500',
  z: 'bg-lime-500',
};

// Función para obtener el color basado en la primera letra del email para diversos usos
export const getColorFromEmail = (email: string): string => {
  const firstLetter = email.charAt(0).toLowerCase();
  return letterToColorMap[firstLetter] || 'bg-gray-500'; // Default color if letter not mapped
};
