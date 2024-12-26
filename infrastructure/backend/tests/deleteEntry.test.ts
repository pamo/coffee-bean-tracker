import { handler } from '../src/handlers/deleteEntry';
import { dynamoDb } from '../src/utils/dynamodb';
import { createEvent } from './utils';
jest.mock('../src/utils/dynamodb', () => ({
	dynamoDb: {
		delete: jest.fn(),
	},
}));

describe('deleteEntry handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should delete a coffee bean successfully', async () => {
		const event = createEvent(null, { beanId: '123' });

		(dynamoDb.delete as jest.Mock).mockResolvedValue({});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.delete).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').message).toBe('Bean deleted successfully!');
	});

	it('should return 400 if beanId is missing', async () => {
		const event = createEvent({});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('Missing beanId in path parameters');
	});
});
