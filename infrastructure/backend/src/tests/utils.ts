import { APIGatewayProxyEvent } from 'aws-lambda';

export const createEvent = (body: any, pathParameters: any = null): APIGatewayProxyEvent => ({
	body: JSON.stringify(body),
	headers: {},
	multiValueHeaders: {},
	httpMethod: 'POST',
	isBase64Encoded: false,
	path: '',
	pathParameters,
	queryStringParameters: null,
	multiValueQueryStringParameters: null,
	stageVariables: null,
	requestContext: {} as any,
	resource: '',
});
