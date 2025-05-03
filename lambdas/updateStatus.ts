import { SNSHandler } from "aws-lambda";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient())
const tableName = process.env.IMAGE_TABLE_NAME || "ImagesTable";

export const handler: SNSHandler = async (event) =>{
    console.log("SNS Event:", JSON.stringify(event));
    for(const record of event.Records){
        try{
            const {id, date, update} = JSON.parse(record.Sns.Message);
            if(!["Pass", "Reject"].includes(update.status)){
                console.error("Invalid status", update.status);
                continue;
            }
            console.log(`Updating status for ${id}: ${update.status}, ${update.reason}`);
            await client.send(new UpdateCommand({
                TableName: tableName,
                Key: {imageId: id},
                UpdateExpression: "SET #status = :status, #reason = :reason, #date = :date",
                ExpressionAttributeNames:{
                    "#status": "status",
                    "#reason": "reason",
                    "#date": "date"
                },
                ExpressionAttributeValues:{
                    ":status": update.status,
                    ":reason": update.reason,
                    ":date": date
                }
            }));
        }catch(err){
            console.error("Status update failed: ", err);
        }
    }
};