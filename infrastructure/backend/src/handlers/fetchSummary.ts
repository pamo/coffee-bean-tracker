import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb, CoffeeBean } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';

interface CoffeeSummary {
	totalBeans: number;
	roasterCounts: { [key: string]: number };
	recentBeans: CoffeeBean[];
	averageBeansPerMonth: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const result = await dynamoDb.scan({
			TableName: process.env.TABLE_NAME!
		});

		const items = result.Items as CoffeeBean[];

		// Calculate summary statistics
		const summary: CoffeeSummary = {
			totalBeans: items.length,
			roasterCounts: {},
			recentBeans: items
				.sort((a, b) => b.DateAdded.localeCompare(a.DateAdded))
				.slice(0, 5),
			averageBeansPerMonth: 0
		};

		// Calculate roaster counts
		items.forEach(bean => {
			summary.roasterCounts[bean.Roaster] =
				(summary.roasterCounts[bean.Roaster] || 0) + 1;
		});

		// Calculate average beans per month
		if (items.length > 0) {
			const oldestDate = new Date(Math.min(...items.map(b =>
				new Date(b.DateAdded).getTime()
			)));
			const monthsDiff = Math.max(1,
				(new Date().getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
			);
			summary.averageBeansPerMonth = items.length / monthsDiff;
		}

		return createResponse(200, summary);
	} catch (error) {
		console.error('Error fetching summary:', error);
		return createResponse(500, {
			message: 'Error fetching coffee summary'
		});
	}
};
