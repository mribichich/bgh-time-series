import { encodePoint } from './main';

describe('createPoint', () => {
  test('should create point', () => {
    const mapData = new Map([['key1', 'val1'], ['key2', 'val2']]);

    expect(encodePoint('mm2', mapData, 123.456)).toBe('mm2,key1=val1,key2=val2 value=123.456');
  });
});
