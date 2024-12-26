import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { dynamoDb } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const params = {
			TableName: process.env.TABLE_NAME!,
		};

		const result = await dynamoDb.scan(params);
		const items = result.Items || [];

		const summary = {
			totalBeans: items.length,
			roasters: [...new Set(items.map((item: any) => item.Roaster))],
			recentBeans: items.sort((a: any, b: any) => new Date(b.DateAdded).getTime() - new Date(a.DateAdded).getTime()).slice(0, 5),
			averageBeansPerMonth: 0,
		};

		if (items.length > 0) {
			const firstDate = new Date(items[items.length - 1].DateAdded);
			const lastDate = new Date(items[0].DateAdded);
			const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + lastDate.getMonth() - firstDate.getMonth() + 1;
			summary.averageBeansPerMonth = items.length / monthsDiff;
		}

		return createResponse(200, { summary });
	} catch (error) {
		const message = 'Error Fetching Summary';
		if (error instanceof Error) {
			return createResponse(500, { message }, error);
		} else {
			return createResponse(500, { message, error: String(error) });
		}
	}
};
