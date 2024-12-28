import { handler } from '../src/handlers/updateEntry';
import { dynamoDb } from '../src/utils/dynamodb';
import { createEvent } from './utils';

jest.mock('../src/utils/dynamodb', () => ({
	dynamoDb: {
		update: jest.fn(),
	},
}));

describe('updateEntry handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should update a coffee bean successfully', async () => {
		const event = createEvent({
			name: 'Updated Bean',
			roaster: 'Updated Roaster',
			roastDate: '2024-01-02'
		}, { beanId: '123' });

		(dynamoDb.update as jest.Mock).mockResolvedValue({
			Attributes: {
				beanId: '123',
				name: 'Updated Bean',
				roaster: 'Updated Roaster',
				roastDate: '2024-01-02',
			},
		});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.update).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').message).toBe('Bean updated successfully!');
	});

	it('should return 400 if request body is missing', async () => {
		const event = createEvent(null, { beanId: '123' });

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('Missing request body');
	});

	it('should return 400 if beanId is missing', async () => {
		const event = createEvent({
			name: 'Updated Bean',
			roaster: 'Updated Roaster',
			roastDate: '2024-01-02'
		});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('Missing beanId in path parameters');
	});

	it('should return 400 if no valid fields to update', async () => {
		const event = createEvent({}, { beanId: '123' });

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('No valid fields to update');
	});

	it('should update only the provided fields', async () => {
		const event = createEvent({
			name: 'Updated Bean'
		}, { beanId: '123' });

		(dynamoDb.update as jest.Mock).mockResolvedValue({
			Attributes: {
				beanId: '123',
				name: 'Updated Bean',
				roaster: 'Original Roaster',
				roastDate: '2024-01-01',
			},
		});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.update).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').message).toBe('Bean updated successfully!');
		expect(JSON.parse(response?.body || '').updatedBean).toEqual({
			beanId: '123',
			name: 'Updated Bean',
			roaster: 'Original Roaster',
			roastDate: '2024-01-01',
		});
	});
});
