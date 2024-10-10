class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.body = JSON.stringify({
            data: this.data,
            message: this.message,
            success: this.success
        });
    }
}

module.exports = { ApiResponse };
