import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	PutCommand,
	ScanCommand,
	QueryCommand,
	PutCommandInput,
	ScanCommandInput,
	QueryCommandInput,
	GetCommandInput,
	GetCommand,
	UpdateCommandInput,
	UpdateCommand,
	DeleteCommandInput,
	DeleteCommand
} from '@aws-sdk/lib-dynamodb';

const isLocal = process.env.AWS_SAM_LOCAL === 'true';

const client = new DynamoDBClient(isLocal ? {
	endpoint: process.env.DYNAMODB_ENDPOINT,
	region: 'local',
	credentials: {
		accessKeyId: 'LOCAL',
		secretAccessKey: 'LOCAL'
	}
} : {});
const docClient = DynamoDBDocumentClient.from(client);

export interface CoffeeBean {
	beanId: string;
	name: string;
	roaster: string;
	dateAdded: string;
	processingType: string;
	roastDate?: string;
}

export const dynamoDb = {
	put: async (params: PutCommandInput) => {
		return docClient.send(new PutCommand(params));
	},
	scan: async (params: ScanCommandInput) => {
		return docClient.send(new ScanCommand(params));
	},
	query: async (params: QueryCommandInput) => {
		return docClient.send(new QueryCommand(params));
	},
	get: async (params: GetCommandInput) => {
		return docClient.send(new GetCommand(params));
	},
	update: async (params: UpdateCommandInput) => {
		return docClient.send(new UpdateCommand(params));
	},
	delete: async (params: DeleteCommandInput) => {
		return docClient.send(new DeleteCommand(params));
	}
};

