// eslint-disable-next-line
const fs = require('fs');

const readJsonFile = async (filename) => {
  return new Promise((resolve) => {
    fs.readFile(filename, 'utf8', (error, data) => {
      resolve(JSON.parse(data));
    });
  });
};

export const getVersion = async () => {
  const packageJson: any = await readJsonFile('package.json');
  return packageJson?.version || '0.0.1';
};
