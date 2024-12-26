import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (!event.body) {
			return createResponse(400, { message: 'Missing request body' });
		}

		const beanId = event.pathParameters?.beanId;
		const data = JSON.parse(event.body);

		if (!beanId) {
			return createResponse(400, { message: 'Missing beanId in path parameters' });
		}

		const updateParams: UpdateCommandInput = {
			TableName: process.env.TABLE_NAME!,
			Key: { BeanId: beanId },
			UpdateExpression: 'set #name = :name, #roaster = :roaster, #roastDate = :roastDate',
			ExpressionAttributeNames: {
				'#name': 'Name',
				'#roaster': 'Roaster',
				'#roastDate': 'RoastDate',
			},
			ExpressionAttributeValues: {
				':name': data.name,
				':roaster': data.roaster,
				':roastDate': data.roastDate,
			},
			ReturnValues: 'ALL_NEW',
		};

		const result = await dynamoDb.update(updateParams);

		return createResponse(200, { message: 'Bean updated successfully!', updatedBean: result.Attributes });
	} catch (error) {
		const message = 'Error updating bean';
		if (error instanceof Error) {
			return createResponse(500, { message }, error);
		} else {
			return createResponse(500, { message, error: String(error) });
		}
	}
};
