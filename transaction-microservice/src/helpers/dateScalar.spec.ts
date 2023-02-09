import { DateScalar } from './DateScalar';

describe('DateScalar', () => {
  it('should be defined', () => {
    expect(new DateScalar()).toBeDefined();
  });

  it('should return a Date object', () => {
    const dateScalar = new DateScalar();
    expect(dateScalar.parseValue(1614120000000)).toBeInstanceOf(Date);
  });

  it('should return a ISO date string', () => {
    const dateScalar = new DateScalar();
    expect(typeof dateScalar.serialize(new Date(1614120000000))).toBe('string');
  });

  it('should return a Date object', () => {
    const dateScalar = new DateScalar();
    expect(
      dateScalar.parseLiteral({
        kind: 'IntValue' as any,
        value: '1614120000000',
      }),
    ).toBeInstanceOf(Date);
  });
});
