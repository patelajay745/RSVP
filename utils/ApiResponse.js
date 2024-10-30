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
        };
        this.body = JSON.stringify({
            data: data,
            message: message,
        });

        this.multiValueHeaders = multiValueHeaders;
    }
}

module.exports = { ApiResponse };
