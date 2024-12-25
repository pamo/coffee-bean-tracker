import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	PutCommand,
	ScanCommand,
	QueryCommand,
	PutCommandInput,
	ScanCommandInput,
	QueryCommandInput
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export interface CoffeeBean {
	BeanId: string;
	Name: string;
	Roaster: string;
	RoastDate?: string;
	DateAdded: string;
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
	}
};

