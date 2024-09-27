const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1000000000, files: 1 },
});

const s3Uploadv3 = async (files) => {
    const s3client = new S3Client();

    const param = {
        Bucket: "rsvp-themephoto",
        Key: `uploads/${uuid()}-${files.originalname}`,
        Body: files.buffer,
    };

    return await s3client.send(new PutObjectCommand(param));
};

module.exports = {
    upload,
    s3Uploadv3,
};

// export const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: "some-bucket",
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString());
//         },
//     }),
// });
