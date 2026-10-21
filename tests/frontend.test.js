const { formatResult, buildUrl } = require('../src/frontend/app');

describe('frontend helpers', () => {
  test('formatResult integer', () => expect(formatResult(5)).toBe('5'));
  test('formatResult decimal', () => expect(formatResult(2.3456)).toBe('2.35'));
  test('formatResult invalid', () => {
    expect(formatResult('x')).toBe('N/A');
    expect(formatResult(NaN)).toBe('N/A');
  });
  test('buildUrl', () => expect(buildUrl('add', 1, 2)).toBe('/calc/add?a=1&b=2'));
});
