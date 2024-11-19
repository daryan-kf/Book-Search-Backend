import dotenv from "dotenv";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, ScanCommand} from "@aws-sdk/lib-dynamodb";

dotenv.config();

const client = new DynamoDBClient({region: process.env.AWS_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const listBooks = async () => {
  const params = {
    TableName: "books",
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items;
};
