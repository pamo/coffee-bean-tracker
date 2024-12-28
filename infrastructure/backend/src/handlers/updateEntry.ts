import { APIGatewayProxyHandler } from 'aws-lambda';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const data = JSON.parse(event?.body || '');
		if (!data) {
			return createResponse(400, { message: 'Missing request body' });
		}

		const beanId = event.pathParameters?.beanId;
		if (!beanId) {
			return createResponse(400, { message: 'Missing beanId in path parameters' });
		}

		const updateExpressions = [];
		const expressionAttributeNames: { [key: string]: string } = {};
		const expressionAttributeValues: { [key: string]: any } = {};

		const { name, roaster, roastDate } = data;
		if (name) {
			updateExpressions.push('#name = :name');
			expressionAttributeNames['#name'] = 'Name';
			expressionAttributeValues[':name'] = data.name;
		}

		if (roaster) {
			updateExpressions.push('#roaster = :roaster');
			expressionAttributeNames['#roaster'] = 'Roaster';
			expressionAttributeValues[':roaster'] = data.roaster;
		}

		if (roastDate) {
			updateExpressions.push('#roastDate = :roastDate');
			expressionAttributeNames['#roastDate'] = 'RoastDate';
			expressionAttributeValues[':roastDate'] = data.roastDate;
		}

		if (updateExpressions.length === 0) {
			return createResponse(400, { message: 'No valid fields to update' });
		}

		if (data.processingType) {
			updateExpression.push('#processingType = :processingType');
			expressionAttributeNames['#processingType'] = 'processingType';
			expressionAttributeValues[':processingType'] = data.processingType;
		}

		const updateParams: UpdateCommandInput = {
			TableName: process.env.TABLE_NAME!,
			Key: { beanId },
			UpdateExpression: 'set ' + updateExpressions.join(', '),
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW' as const,
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
