import { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb, CoffeeBean } from '../utils/dynamodb';
import { createResponse } from '../utils/apiResponses';
import { randomUUID } from 'crypto';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return createResponse(400, { message: 'Missing request body' });
    }

    const data = JSON.parse(event.body);
    const { name, origin, roaster, roastDate, processingType } = data;

    // Validate required fields
    if (!name || !roaster || !origin || !processingType) {
      return createResponse(400, {
        message: 'Missing required fields: name, roaster, origin, processingType are required',
      });
    }

    // Validate roastDate if provided
    if (roastDate) {
      const parsedRoastDate = Date.parse(roastDate);
      if (isNaN(parsedRoastDate)) {
        return createResponse(400, {
          message: 'Invalid roastDate format',
        });
      }
    }

    const beanId = randomUUID();
    const item: CoffeeBean = {
      beanId,
      name,
      roaster,
      origin,
      roastDate,
      dateAdded: new Date().toISOString(),
      processingType: processingType,
    };

    const params = {
      TableName: process.env.TABLE_NAME!,
      Item: item,
    };

    await dynamoDb.put(params);

    return createResponse(200, {
      message: 'Coffee added successfully!',
      bean: item,
    });
  } catch (error) {
    const message = 'Error adding new coffee';
    if (error instanceof Error) {
      return createResponse(500, { message }, error);
    } else {
      return createResponse(500, { message, error: String(error) });
    }
  }
};
