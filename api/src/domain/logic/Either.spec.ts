import { left, Left, right, Right } from './Either';

describe('Logic - Either', () => {
	it('Left class should be understood as left', async () => {
		const left = new Left('any_value');

		expect(left.value).toBe('any_value');
		expect(left.isLeft()).toBeTruthy();
		expect(left.isRight()).toBeFalsy();
	});

	it('Right class should be understood as right', async () => {
		const right = new Right('any_value');

		expect(right.value).toBe('any_value');
		expect(right.isRight()).toBeTruthy();
		expect(right.isLeft()).toBeFalsy();
	});

	it('left method should return a Left instance on left method', async () => {
		const leftReturn = left('any_value');

		expect(leftReturn).toBeInstanceOf(Left);
	});

	it('right method should return a Right instance on right method', async () => {
		const rightReturn = right('any_value');

		expect(rightReturn).toBeInstanceOf(Right);
	});
});
