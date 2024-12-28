import { handler } from '../src/handlers/fetchSummary';
import { dynamoDb } from '../src/utils/dynamodb';
import { createEvent } from './utils';

jest.mock('../src/utils/dynamodb', () => ({
	dynamoDb: {
		scan: jest.fn(),
	},
}));

describe('fetchSummary handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should fetch summary of coffee beans', async () => {
		(dynamoDb.scan as jest.Mock).mockResolvedValue({
			Items: [
				{
					beanId: '123',
					name: 'Test Bean',
					roaster: 'Test Roaster',
					roastDate: '2024-01-01',
					dateAdded: '2024-01-01'
				},
				{
					beanId: '124',
					name: 'Another Bean',
					roaster: 'Another Roaster',
					roastDate: '2024-02-01',
					dateAdded: '2024-02-01'
				}
			]
		});

		const response = await handler(createEvent(null));

		expect(response?.statusCode).toBe(200);
		expect(dynamoDb.scan).toHaveBeenCalled();
		expect(JSON.parse(response?.body || '').summary).toEqual({
			totalBeans: 2,
			roasters: ['Test Roaster', 'Another Roaster'],
			recentBeans: [
				{
					beanId: '124',
					name: 'Another Bean',
					roaster: 'Another Roaster',
					roastDate: '2024-02-01',
					dateAdded: '2024-02-01'
				},
				{
					beanId: '123',
					name: 'Test Bean',
					roaster: 'Test Roaster',
					roastDate: '2024-01-01',
					dateAdded: '2024-01-01'
				}
			],
			averageBeansPerMonth: 1
		});
	});
});
