/**
 * @jest-environment node
 */
 import compiler from '../example/compiler.js';

 test('Inserts name and outputs JavaScript', async () => {
   const stats = await compiler('example.txt', { name: 'Alice' });
   const output = stats.toJson({ source: true }).modules[0].source;

   console.log(stats.toJson({ source: true }))
   expect(output).toBe('export default "Hey Alice;"');
 });