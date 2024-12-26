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
					BeanId: '123',
					Name: 'Test Bean',
					Roaster: 'Test Roaster',
					RoastDate: '2024-01-01',
					DateAdded: '2024-01-01'
				},
				{
					BeanId: '124',
					Name: 'Another Bean',
					Roaster: 'Another Roaster',
					RoastDate: '2024-02-01',
					DateAdded: '2024-02-01'
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
					BeanId: '124',
					Name: 'Another Bean',
					Roaster: 'Another Roaster',
					RoastDate: '2024-02-01',
					DateAdded: '2024-02-01'
				},
				{
					BeanId: '123',
					Name: 'Test Bean',
					Roaster: 'Test Roaster',
					RoastDate: '2024-01-01',
					DateAdded: '2024-01-01'
				}
			],
			averageBeansPerMonth: 1
		});
	});
});
