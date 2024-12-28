import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const beanId = event.pathParameters?.beanId && String(event.pathParameters?.beanId);

		if (!beanId) {
			return createResponse(400, { message: 'Missing beanId in path parameters' });
		}

		const deleteParams = {
			TableName: process.env.TABLE_NAME!,
			Key: { beanId },
		};

		console.log(`Delete parameters: ${JSON.stringify(deleteParams)}`);
		const result = await dynamoDb.delete(deleteParams);
		console.log(`Delete result: ${JSON.stringify(result)}`);

		return createResponse(200, { message: 'Bean deleted successfully!' });
	} catch (error) {
		const message = 'Error deleting bean';
		if (error instanceof Error) {
			return createResponse(500, { message }, error);
		} else {
			return createResponse(500, { message, error: String(error) });
		}
	}
};
