class ApiResponse {
    constructor(
        statusCode,
        message = "Success",
        data = {},
        headers = null,
        multiValueHeaders = null
    ) {
        this.statusCode = statusCode;
        this.body = JSON.stringify({
            data: data,
            message: message,
        });
        this.headers = headers;
        this.multiValueHeaders = multiValueHeaders;
    }
}

module.exports = { ApiResponse };
