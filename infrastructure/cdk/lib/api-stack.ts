import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Construct } from 'constructs';

export class ApiStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDB table
		const coffeeTable = new dynamodb.Table(this, 'CoffeeDataTable', {
			tableName: 'CoffeeBeans',
			partitionKey: { name: 'beanId', type: dynamodb.AttributeType.STRING },
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.RETAIN, // Protect the table from accidental deletion
		});

		// Lambda functions
		const addBeanFunction = new NodejsFunction(this, 'AddBeanFunction', {
			runtime: lambda.Runtime.NODEJS_18_X,
			entry: path.join(__dirname, '../../backend/src/handlers/addEntry.ts'),
			handler: 'handler',
			environment: {
				TABLE_NAME: coffeeTable.tableName,
			},
		});

		const fetchBeanDetailsFunction = new NodejsFunction(this, 'FetchBeanDetailsFunction', {
			runtime: lambda.Runtime.NODEJS_18_X,
			entry: path.join(__dirname, '../../backend/src/handlers/fetchBeanDetails.ts'),
			handler: 'handler',
			environment: {
				TABLE_NAME: coffeeTable.tableName,
			},
		});

		const getSummaryFunction = new NodejsFunction(this, 'GetSummaryFunction', {
			runtime: lambda.Runtime.NODEJS_18_X,
			entry: path.join(__dirname, '../../backend/src/handlers/fetchSummary.ts'),
			handler: 'handler',
			environment: {
				TABLE_NAME: coffeeTable.tableName,
			},
		});

		const updateBeanFunction = new NodejsFunction(this, 'UpdateBeanFunction', {
			runtime: lambda.Runtime.NODEJS_18_X,
			entry: path.join(__dirname, '../../backend/src/handlers/updateEntry.ts'),
			handler: 'handler',
			environment: {
				TABLE_NAME: coffeeTable.tableName,
			},
		});

		const deleteBeanFunction = new NodejsFunction(this, 'DeleteBeanFunction', {
			runtime: lambda.Runtime.NODEJS_18_X,
			entry: path.join(__dirname, '../../backend/src/handlers/deleteEntry.ts'),
			handler: 'handler',
			environment: {
				TABLE_NAME: coffeeTable.tableName,
			},
		});

		// Grant DynamoDB permissions
		coffeeTable.grantWriteData(addBeanFunction);
		coffeeTable.grantWriteData(updateBeanFunction);
		coffeeTable.grantWriteData(deleteBeanFunction);
		coffeeTable.grantReadData(fetchBeanDetailsFunction);
		coffeeTable.grantReadData(getSummaryFunction);

		// API Gateway
		const api = new apigateway.RestApi(this, 'CoffeeAppApi', {
			restApiName: 'CoffeeAppAPI',
			defaultCorsPreflightOptions: {
				allowOrigins: apigateway.Cors.ALL_ORIGINS,
				allowMethods: apigateway.Cors.ALL_METHODS,
			},
		});

		const beansResource = api.root.addResource('beans');
		beansResource.addMethod('POST', new apigateway.LambdaIntegration(addBeanFunction));
		beansResource.addMethod('GET', new apigateway.LambdaIntegration(getSummaryFunction));

		const beanResource = beansResource.addResource('{beanId}');
		beanResource.addMethod('GET', new apigateway.LambdaIntegration(fetchBeanDetailsFunction));
		beanResource.addMethod('PUT', new apigateway.LambdaIntegration(updateBeanFunction));
		beanResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteBeanFunction));

	}
}
