import { TestBed } from '@angular/core/testing';
import { LoggerFactory } from './logger-factory.service';

describe('LoggerFactory', () => {
	let service: LoggerFactory;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoggerFactory);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
