const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

module.exports.connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("mongoDb connected", connectionInstance.connection.name);
    } catch (error) {
        console.log("mongoDb connection error", error);
    }
};
