const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const { nanoid } = require("nanoid");
const ID = nanoid();

const uploadOnS3 = (file) => {
    let themephoto = null;

    if (!file) {
        return { err: null, themephoto };
    }

    const fileExtension = file.originalname.split(".").pop();
    const newKey = `${ID}.${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_BUCKETNAME,
        Key: newKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err);
                return reject({ err, themephoto: null });
            }

            resolve({ err: null, themephoto: data?.Location });
        });
    });
};

module.exports = {
    uploadOnS3,
};
