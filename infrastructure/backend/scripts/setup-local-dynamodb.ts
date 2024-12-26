import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const createTable = async () => {
  const client = new DynamoDBClient({
    endpoint: 'http://dynamodb-local:8000',
    region: 'local',
    credentials: {
      accessKeyId: 'LOCAL',
      secretAccessKey: 'LOCAL'
    }
  });

  try {
    const command = new CreateTableCommand({
      TableName: 'CoffeeTable',
      KeySchema: [
        { AttributeName: 'BeanId', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'BeanId', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    });

    await client.send(command);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

createTable();
