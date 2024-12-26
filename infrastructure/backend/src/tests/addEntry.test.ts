import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../handlers/addEntry';
import { dynamoDb } from '../utils/dynamodb';

jest.mock('../utils/dynamodb');

const createEvent = (body: any): APIGatewayProxyEvent => ({
	body: JSON.stringify(body),
	headers: {},
	multiValueHeaders: {},
	httpMethod: 'POST',
	isBase64Encoded: false,
	path: '',
	pathParameters: null,
	queryStringParameters: null,
	multiValueQueryStringParameters: null,
	stageVariables: null,
	requestContext: {} as any,
	resource: '',
});

describe('addEntry handler', () => {
	beforeEach(() => {
		process.env.TABLE_NAME = 'TestTable';
		jest.clearAllMocks();
	});

	it('should add a new coffee bean', async () => {
		const event = createEvent({
			name: 'Test Bean',
			roaster: 'Test Roaster',
			roastDate: '2024-01-01'
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
			roastDate: 'invalid-date'
		});

		const response = await handler(event, {} as any, {} as any);

		expect(response?.statusCode).toBe(400);
		expect(JSON.parse(response?.body || '').message).toBe('Invalid roastDate format');
	});
});
