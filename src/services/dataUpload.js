import dotenv from "dotenv";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import fs from "fs";

dotenv.config();

const client = new DynamoDBClient({region: process.env.AWS_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const uploadBooks = async () => {
  try {
    const data = fs.readFileSync("fetch_books.json", "utf8");
    const books = JSON.parse(data);

    for (const book of books) {
      const params = {
        TableName: process.env.AWS_TABLE_NAME,
        Item: {
          ...book,
        },
      };

      await ddbDocClient.send(new PutCommand(params));
      console.log([ddbDocClient]);
      console.log(`Uploaded book: ${book.title}`);
    }
  } catch (err) {
    console.error("Error uploading books:", err);
  }
};

uploadBooks();
