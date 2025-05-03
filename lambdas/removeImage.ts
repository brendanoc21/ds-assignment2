import { SQSHandler } from "aws-lambda";
import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const handler: SQSHandler = async (event) => {
  console.log("removeImage.ts activated");
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    const snsMessage = JSON.parse(recordBody.Message); 

    if (snsMessage.Records) {
      for (const messageRecord of snsMessage.Records) {
        const s3e = messageRecord.s3;
        const bucketName = s3e.bucket.name;
        const objectKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));

        try {
            console.log(`Removing ${objectKey} from ${bucketName}`)
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: objectKey,
                })
            );
        } catch(error){
            console.error("Error - Failed to delete object", error)
        }
      }
    }
  }
};