class ApiResponse {
    constructor(statusCode, message = "Success", data = {}, headers) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
        this.body = JSON.stringify({
            data: this.data,
            message: this.message,
            success: this.success,
        });
        this.data = data;
        this.headers = headers;
    }
}

module.exports = { ApiResponse };
