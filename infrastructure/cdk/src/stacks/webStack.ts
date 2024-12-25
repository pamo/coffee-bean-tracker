// infrastructure/cdk/src/stacks/webStack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class WebStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// S3 bucket for web app
		const webBucket = new s3.Bucket(this, 'CoffeeAppBucket', {
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: 'error.html',
			removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - adjust for production
		});

		// CloudFront distribution
		new cloudfront.Distribution(this, 'CloudFrontDistribution', {
			defaultBehavior: {
				origin: new origins.S3Origin(webBucket),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
				cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
			},
			defaultRootObject: 'index.html',
		});
	}
}
