import { faker } from '@faker-js/faker/.';
import { Entity } from '@mikro-orm/core';
import { Utils } from '~/app/utils/services/utils/utils.service';
import { BaseEntity } from './base.entity';

class ConcreteEntity extends BaseEntity {}

beforeEach(() => {
	jest.useFakeTimers();
	jest.setSystemTime(new Date(Date.UTC(1975)));

	faker.seed(
		Utils.genSeedFromString(expect.getState().currentTestName ?? Entity.name),
	);
});

describe('BaseEntity', () => {
	it('should be defined', () => {
		expect(new ConcreteEntity()).toBeDefined();
	});

	it('should have properties values', () => {
		const entity = new ConcreteEntity();
		entity.id = faker.string.uuid();
		entity.createdAt = faker.date.past();
		entity.updatedAt = faker.date.future({ refDate: entity.createdAt });

		expect(entity.id).toBe('7c09c5c4-8eee-490d-9dcf-4c16d77a381d');

		expect(entity.createdAt).toBeInstanceOf(Date);

		expect(entity.createdAt.getTime()).toBe(
			new Date('1974-09-15T16:34:42.467Z').getTime(),
		);

		expect(entity.updatedAt).toBeInstanceOf(Date);

		expect(entity.updatedAt.getTime()).toBe(
			new Date('1975-01-18T04:05:43.496Z').getTime(),
		);
	});

	describe('onUpdate', () => {
		it('should return a new date', () => {
			expect(ConcreteEntity.onUpdateNewDate().getTime()).toEqual(
				new Date('1975-01-01').getTime(),
			);
		});
	});
});
