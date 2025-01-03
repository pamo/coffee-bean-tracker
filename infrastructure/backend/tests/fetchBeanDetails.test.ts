import { handler } from '../src/handlers/fetchBeanDetails';
import { dynamoDb } from '../src/utils/dynamodb';
import { createEvent } from './utils';

jest.mock('../src/utils/dynamodb', () => ({
	dynamoDb: {
		get: jest.fn(),
	},
}));

describe('fetchBeanDetails handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should fetch coffee bean details', async () => {
		const event = createEvent(null, { beanId: '123' });

		(dynamoDb.get as jest.Mock).mockResolvedValue({
			Item: {
				beanId: '123',
				name: 'Test Bean',
				roaster: 'Test Roaster',
				roastDate: '2024-01-01',
				dateAdded: '2024-01-01'
			}
		});

		const response = await handler(event);

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.get).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').bean).toEqual({
			beanId: '123',
			name: 'Test Bean',
			roaster: 'Test Roaster',
			roastDate: '2024-01-01',
			dateAdded: '2024-01-01'
		});
	});

	it('should return 404 if bean not found', async () => {
		const event = createEvent(null, { beanId: '123' });

		(dynamoDb.get as jest.Mock).mockResolvedValue({});

		const response = await handler(event);

		expect(response?.statusCode).toBe(404);
		expect(JSON.parse(response?.body || '').message).toBe('Bean not found');
	});
});
