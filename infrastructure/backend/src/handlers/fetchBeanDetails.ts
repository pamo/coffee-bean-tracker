import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const { beanId } = event.pathParameters || {};
		if (!beanId) {
			return createResponse(400, {
				message: 'Missing beanId parameter'
			});
		}

	try {
		const params = {
			TableName: process.env.TABLE_NAME!,
			Key: { beanId },
		};

		const result = await dynamoDb.get(params);

		if (!result.Item) {
			return createResponse(404, { message: 'Bean not found' });
		}

		return createResponse(200, { bean: result.Item });
	} catch (error) {
		if (error instanceof Error) {
			return createResponse(500, { message: 'Internal Server Error' }, error);
		} else {
			return createResponse(500, { message: 'Internal Server Error', error: String(error) });
		}
	}
};
