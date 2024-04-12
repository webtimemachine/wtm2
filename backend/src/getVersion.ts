// eslint-disable-next-line
const fs = require('fs');

const readJsonFile = async (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};

export const getVersion = async () => {
  let packageJson: any;

  const paths = ['backend/package.json', './package.json', '../package.json'];

  for (const path of paths) {
    try {
      packageJson = await readJsonFile(path);
      break;
    } catch (error) {}
  }

  return packageJson?.version || '0.0.1';
};
