import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const beanId = event.pathParameters?.beanId;

		if (!beanId) {
			return createResponse(400, {
				message: 'Missing beanId parameter'
			});
		}

		const result = await dynamoDb.query({
			TableName: process.env.TABLE_NAME!,
			KeyConditionExpression: 'BeanId = :beanId',
			ExpressionAttributeValues: {
				':beanId': beanId
			}
		});

		if (!result.Items || result.Items.length === 0) {
			return createResponse(404, {
				message: 'Bean not found'
			});
		}

		return createResponse(200, result.Items[0]);
	} catch (error) {
		console.error('Error fetching bean details:', error);
		return createResponse(500, {
			message: 'Error fetching bean details'
		});
	}
};
