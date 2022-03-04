import * as path from 'path';
export function sum(a: number, b: number) {
  const newPath = path.join('/', 'abc');
  console.log({
    newPath,
  });
  return a + b;
}
