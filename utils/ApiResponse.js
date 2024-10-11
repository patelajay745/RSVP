class ApiResponse {
    constructor(statusCode, message = "Success", data = {}, headers = null) {
        this.statusCode = statusCode;
        this.body = JSON.stringify({
            data: data,
            message: message,
        });
        this.headers = headers;
    }
}

module.exports = { ApiResponse };
