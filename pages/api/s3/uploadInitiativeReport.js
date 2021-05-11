import AWS from 'aws-sdk';
// https://gist.github.com/navjotdhanawat/92f8683ddfc5bf99c6bd47ce6dedaa4e

// Configure AWS
AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: process.env.NEXT_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_S3_SECRET_ACCESS_KEY,
});

// Create client
const S3Client = new AWS.S3();

export default async (req, res) => {
    try {
        const {
            body: { json, fileName },
        } = req;

        // Upload file
        const S3Data = await S3Client.upload({
            Bucket: 'foundgood-initiative-update-content-media',
            Key: `snapshots/${fileName}.json`,
            Body: Buffer.from(JSON.stringify(json)),
            ContentEncoding: 'base64',
            ContentType: 'application/json',
            ACL: 'public-read',
        }).promise();

        res.status(200).json(S3Data);
        return;
    } catch (error) {
        console.log(error);
        // Otherwise fail
        res.status(400).json(error);
        return;
    }
};
