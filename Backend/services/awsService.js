import AWS from "aws-sdk";

export default class AWSService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadToS3(key, data, contentType) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: data,
      ACL: "public-read",
      ContentType: contentType,
      ContentDisposition: "attachment",
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}
