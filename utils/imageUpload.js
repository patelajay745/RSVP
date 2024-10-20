const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const { nanoid } = require("nanoid");
const ID = nanoid();

const uploadOnS3 = (file) => {
    const fileObject = file[0];

    if (!fileObject) {
        return { err: null, themephoto: null };
    }

    const fileExtension = fileObject.filename.split(".").pop();
    const newKey = `${ID}.${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_BUCKETNAME + "/rsvp",
        Key: newKey,
        Body: fileObject.content,
        ContentType: fileObject.contentType,
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
