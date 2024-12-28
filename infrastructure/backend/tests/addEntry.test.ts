import { handler } from '../src/handlers/addEntry';
import { dynamoDb } from '../src/utils/dynamodb';
import { createEvent } from './utils';

jest.mock('../src/utils/dynamodb', () => ({
	dynamoDb: {
		put: jest.fn(),
	},
}));

describe('addEntry handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should add a new coffee bean', async () => {
		const event = createEvent({
			name: 'Test Bean',
			roaster: 'Test Roaster',
			roastDate: '2024-01-01',
			origin: 'Mars',
			processingType: 'Washed'
		});

		(dynamoDb.put as jest.Mock).mockResolvedValue({});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.put).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').message).toBe('Bean added successfully!');
	});

	it('should reject invalid roast date', async () => {
		const event = createEvent({
			name: 'Test Bean',
			roaster: 'Test Roaster',
			roastDate: 'invalid-date',
			origin: 'Mars',
			processingType: 'Washed'
		});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('Invalid roastDate format');
	});
});
