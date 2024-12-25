# Coffee Bean Tracker
Welcome to the Coffee Bean Tracker project! This project is designed to help you track coffee beans, their roasters, and other related details. The project is built using AWS services, including Lambda, DynamoDB, API Gateway, and CloudFront, and is structured to be easily deployable using AWS CDK.

## Project Structure
The project is organized into several directories, each serving a specific purpose:

```bash
.gitignore
.node-version
.vscode/
    settings.json
cloudformation-template.yaml
infrastructure/
    backend/
        package.json
        src/
            handlers/
                addEntry.ts
                fetchBeanDetails.ts
                fetchSummary.ts
            tests/
                addEntry.test.ts
            utils/
                apiResponses.ts
                dynamodb.ts
        template.yaml
    cdk/
        src/
            app.ts
            stacks/
                apiStack.ts
                webStack.ts
package.json
web/
    package.json
```

### Backend
The backend directory contains the Lambda functions and utilities for interacting with DynamoDB.

* Handlers: This directory contains the Lambda function handlers.
	* addEntry.ts: Handles adding a new coffee bean entry to DynamoDB.
	* fetchBeanDetails.ts: Fetches details of a specific coffee bean.
	* fetchSummary.ts: Fetches a summary of all coffee beans.
* Utils: This directory contains utility functions.
	* apiResponses.ts: Utility for creating API responses.
	* dynamodb.ts: Utility for interacting with DynamoDB.
* Tests: This directory contains unit tests for the handlers.
	* addEntry.test.ts: Tests for the addEntry handler.

### CDK
The CDK directory contains the AWS CDK code for deploying the infrastructure.

#### Stacks: This directory contains the CDK stack definitions.
* apiStack.ts: Defines the API Gateway, Lambda functions, and DynamoDB table.
* webStack.ts: Defines the S3 bucket and CloudFront distribution for the web app.
* app.ts: The entry point for the CDK application, which initializes the stacks.

#### Web
The web directory contains the frontend code for the Coffee Bean Tracker web application.

* package.json: Defines the dependencies and scripts for building and running the web app.

#### Root Files

* .gitignore: Specifies files and directories to be ignored by Git.
* .node-version: Specifies the Node.js version to be used.
* cloudformation-template.yaml: An alternative CloudFormation template for deploying the infrastructure.
* package.json: Defines the dependencies and scripts for the entire project.
## Getting Started
### Prerequisites
* Node.js (version specified in .node-version)
* AWS CLI configured with appropriate permissions
* AWS CDK installed globally (npm install -g aws-cdk)

### Installation
1. Clone the repository:
```
git clone <repository-url>
cd coffee-bean-tracker
```

2. Install dependencies: 
```
npm run install:all
```


3. Building the Project
To build the entire project, run:

```
npm run build
```

4. Running Tests

```
npm test
```

5. Deployment

```
npm run deploy
```
This will build the project, deploy the infrastructure using CDK, and deploy the web app to S3.

Local Development
To start the web app in development mode, run:

```
npm run dev:web
```

To start the backend locally using SAM, navigate to the backend directory and run:

```
npm run start:local
```

## Code Overview

Backend Handlers
* addEntry.ts: Adds a new coffee bean entry to DynamoDB. Validates the input and returns appropriate responses.
* fetchBeanDetails.ts: Fetches details of a specific coffee bean based on the beanId parameter.
* fetchSummary.ts: Fetches a summary of all coffee beans, including total count, roaster counts, recent beans, and average beans per month.

CDK Stacks
* apiStack.ts: Defines the API Gateway, Lambda functions, and DynamoDB table. Sets up the necessary permissions and integrations.
* webStack.ts: Defines the S3 bucket for hosting the web app and the CloudFront distribution for serving the app.

Utilities
* apiResponses.ts: Utility for creating standardized API responses.
* dynamodb.ts: Utility for interacting with DynamoDB, including methods for put, scan, and query.
