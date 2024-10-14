module.exports.handler = async (event) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF Documentation</title>
        <style>
            html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                height: 100%;
                width: 100%;
            }
            #pdf-container {
                width: 100%;
                height: 100%;
            }
        </style>
    </head>
    <body>
        <object id="pdf-container" data="https://myapidocuments.s3.amazonaws.com/rsvp/RSVP.pdf" type="application/pdf" width="100%" height="100%">
            <p>PDF cannot be displayed. <a href="https://myapidocuments.s3.amazonaws.com/rsvp/RSVP.pdf">Download PDF</a> instead.</p>
        </object>
    </body>
    </html>
    `;

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
        },
        body: htmlContent,
    };
};
