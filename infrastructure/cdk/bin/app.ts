#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebStack } from '../lib/web-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

new WebStack(app, 'CoffeeAppWebStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION
	}
});

new ApiStack(app, 'CoffeeAppApiStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION
	}
});
