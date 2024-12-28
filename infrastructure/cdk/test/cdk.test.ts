import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApiStack } from '../lib/api-stack';

test('DynamoDB Table Created', () => {
	const app = new cdk.App();
	const stack = new ApiStack(app, 'MyTestStack');
	const template = Template.fromStack(stack);

	template.hasResourceProperties('AWS::DynamoDB::Table', {
		TableName: 'CoffeeBeans',
		BillingMode: 'PAY_PER_REQUEST',
		KeySchema: [
			{
				AttributeName: 'beanId',
				KeyType: 'HASH',
			},
		],
		AttributeDefinitions: [
			{
				AttributeName: 'beanId',
				AttributeType: 'S',
			},
		],
	});
});

test('AddBeanFunction Lambda Created', () => {
	const app = new cdk.App();
	const stack = new ApiStack(app, 'MyTestStack');
	const template = Template.fromStack(stack);

	template.hasResourceProperties('AWS::Lambda::Function', {
		Handler: 'handler',
		Runtime: 'nodejs18.x',
		Environment: {
			Variables: {
				TABLE_NAME: 'CoffeeBeans',
			},
		},
	});
});

test('API Gateway Created', () => {
	const app = new cdk.App();
	const stack = new ApiStack(app, 'MyTestStack');
	const template = Template.fromStack(stack);

	template.hasResourceProperties('AWS::ApiGateway::RestApi', {
		Name: 'CoffeeAppAPI',
	});

	template.resourceCountIs('AWS::ApiGateway::Resource', 3); // Root, /beans, /beans/{beanId}
	template.resourceCountIs('AWS::ApiGateway::Method', 5); // POST /beans, GET /beans, GET /beans/{beanId}, PUT /beans/{beanId}, DELETE /beans/{beanId}
});
