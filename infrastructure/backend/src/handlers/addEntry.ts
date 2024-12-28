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
    const { name, origin, roaster, roastDate, processingType } = data;

    // Validate required fields
    if (!name || !roaster || !origin || !processingType) {
      return createResponse(400, {
        message: 'Missing required fields: name, roaster, origin, processingType are required',
      });
    }

    // Validate roastDate if provided
    if (roastDate && isNaN(Date.parse(roastDate))) {
      return createResponse(400, {
        message: 'Invalid roastDate format',
      });
    }

    const item: CoffeeBean = {
      beanId: `${Date.now()}`,
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
      message: 'Bean added successfully!',
      bean: item,
    });
  } catch (error) {
    return createResponse(500, {
      message: 'Error adding bean to database',
    });
  }
};
