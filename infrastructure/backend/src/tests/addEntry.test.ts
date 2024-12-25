import { handler } from '../handlers/addEntry';
import { dynamoDb } from '../utils/dynamodb';

// Mock DynamoDB client
jest.mock('../utils/dynamodb', () => ({
	dynamoDb: {
		put: jest.fn()
	}
}));

describe('addEntry handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should add a new coffee bean', async () => {
		const event = {
			body: JSON.stringify({
				name: 'Test Bean',
				roaster: 'Test Roaster',
				roastDate: '2024-01-01'
			})
		};

		const response = await handler(event as any, {} as any, {} as any);

		expect(response.statusCode).toBe(200);
		expect(dynamoDb.put).toHaveBeenCalled();
		expect(JSON.parse(response.body).message).toBe('Bean added successfully!');
	});

	it('should reject invalid roast date', async () => {
		const event = {
			body: JSON.stringify({
				name: 'Test Bean',
				roaster: 'Test Roaster',
				roastDate: 'invalid-date'
			})
		};

		const response = await handler(event as any, {} as any, {} as any);

		expect(response.statusCode).toBe(400);
		expect(JSON.parse(response.body).message).toBe('Invalid roastDate format');
	});
});
