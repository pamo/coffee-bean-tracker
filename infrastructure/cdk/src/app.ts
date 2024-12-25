// infrastructure/cdk/src/app.ts
import * as cdk from 'aws-cdk-lib';
import { WebStack } from './stacks/webStack';
import { ApiStack } from './stacks/apiStack';

const app = new cdk.App();

new WebStack(app, 'CoffeeAppWebStack');
new ApiStack(app, 'CoffeeAppApiStack');
