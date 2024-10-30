class ApiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = {},
        headers = null,
        multiValueHeaders = null
    ) {
        this.statusCode = statusCode;
        this.headers = {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers":
                "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        };
        this.body = JSON.stringify({
            data: data,
            message: message,
        });

        if (headers) {
            this.headers = { ...this.headers, ...headers };
        }

        // Handle cookies properly for Lambda
        if (multiValueHeaders) {
            this.multiValueHeaders = multiValueHeaders;
        }
    }
}

module.exports = { ApiResponse };
