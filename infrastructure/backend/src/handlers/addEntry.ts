// infrastructure/backend/src/handlers/addEntry.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb, CoffeeBean } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (!event.body) {
			return createResponse(400, { message: 'Missing request body' });
		}

		const data = JSON.parse(event.body);

		// Validate required fields
		if (!data.name || !data.roaster) {
			return createResponse(400, {
				message: 'Missing required fields: name and roaster are required'
			});
		}

		// Validate roastDate if provided
		if (data.roastDate && isNaN(Date.parse(data.roastDate))) {
			return createResponse(400, {
				message: 'Invalid roastDate format'
			});
		}

		const item: CoffeeBean = {
			BeanId: `${Date.now()}`,
			Name: data.name,
			Roaster: data.roaster,
			RoastDate: data.roastDate || undefined,
			DateAdded: new Date().toISOString()
		};

		await dynamoDb.put({
			TableName: process.env.TABLE_NAME!,
			Item: item
		});

		return createResponse(200, {
			message: 'Bean added successfully!',
			bean: item
		});
	} catch (error) {
		console.error('Error adding bean:', error);
		return createResponse(500, {
			message: 'Error adding bean to database'
		});
	}
};
