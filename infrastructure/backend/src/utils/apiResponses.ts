export const createResponse = (statusCode: number, body: any, error?: Error) => {
	const responseBody = error ? { ...body, error: error.message } : body;

	return {
		statusCode,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(responseBody)
	};
};

