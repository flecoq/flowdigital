import fs from 'fs/promises';

export async function getData(filename: string) {
  const rawFileContent = await fs.readFile(filename, { encoding: 'utf-8' });
  try {
     return JSON.parse(rawFileContent);
  } catch (error) {
    return null;
  }
}