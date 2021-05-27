import AWS from 'aws-sdk';
import fs from 'fs';
// https://gist.github.com/navjotdhanawat/92f8683ddfc5bf99c6bd47ce6dedaa4e
import formidable from 'formidable';

// Configure AWS
AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: process.env.NEXT_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_S3_SECRET_ACCESS_KEY,
});

// Create client
const S3Client = new AWS.S3();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        const formFiles = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });

        const readFile = fs.readFileSync(formFiles.file.path);

        // Upload file
        const S3Data = await S3Client.upload({
            Bucket: 'foundgood-initiative-update-content-media',
            Key: formFiles.file.name,
            Body: readFile,
            ContentType: formFiles.file.type,
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
