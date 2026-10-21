const request = require('supertest');
const app = require('../src/backend/app');
const { add, subtract, multiply, divide } = require('../src/backend/utils');

describe('utils', () => {
  test('add', () => expect(add(2, 3)).toBe(5));
  test('subtract', () => expect(subtract(5, 3)).toBe(2));
  test('multiply', () => expect(multiply(4, 3)).toBe(12));
  test('divide', () => expect(divide(6, 3)).toBe(2));
  test('divide by zero throws', () => expect(() => divide(1, 0)).toThrow('Division by zero'));
});

describe('API', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });
  test('GET /calc/add', async () => {
    const res = await request(app).get('/calc/add?a=2&b=3');
    expect(res.body.result).toBe(5);
  });
  test('invalid op returns 400', async () => {
    const res = await request(app).get('/calc/pow?a=2&b=3');
    expect(res.status).toBe(400);
  });
  test('invalid number returns 400', async () => {
    const res = await request(app).get('/calc/add?a=x&b=3');
    expect(res.status).toBe(400);
  });
  test('divide by zero returns 400', async () => {
    const res = await request(app).get('/calc/divide?a=1&b=0');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Division by zero');
  });
});
