<!--
title: 'Serverless Framework Node Express API on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# About Project

Project Description:
The Event RSVP Application is a web-based platform that allows users to create and manage events, send invitations, and track guest responses in real-time. Event organizers can easily configure event details, toggle the event status (open or closed), and manage attendance. The application provides a secure login system using JWT tokens for organizers, allowing them to view detailed attendance reports and communicate with guests.

Use Case:
User Signup and Event Creation (POST /signup):

A new user signs up by providing event details such as event name, date and time, venue, theme, and confirmation email.
The event is assigned a unique URL based on the event name.
On successful creation, the event is stored in the database, and the organizer can log in to manage the event.
Toggle Event Status (PATCH /event/{id}/status):

The event organizer can toggle the event status between "open" and "closed."
When closing the event, the organizer can provide a custom message, which will be shown when the event URL is accessed by guests.
If the event is open, the response includes a link that guests can use to RSVP.
Event Access and RSVP (GET /event/{eventName} and POST /event/{eventName}/rsvp):

Guests access the event URL to view all event details (e.g., date, time, venue, etc.).
To RSVP, guests can send a POST request with the number of attendees, their first and last names, and an email to receive reminders.
View Attendance (GET /event/{id}/attendees):

Event organizers can retrieve a detailed list of attendees and non-attendees (those who haven’t RSVP'd yet) via a GET request.
This allows organizers to track attendance and send reminders if needed.
Organizer Login (POST /login):

Organizers can log in using their email and password to receive a JWT token.
The JWT token is required for all event management actions, such as updating the event status or viewing guest details.
Authentication for Organizers:

All sensitive operations, such as updating event status or accessing the attendee list, require the organizer to provide a valid JWT token, ensuring secure access.
This project provides a complete solution for creating and managing events, making it easy for organizers to track attendance and communicate with their guests efficiently. Let me know if you'd like to add any more details!

# Serverless Framework Node Express API on AWS

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-api-project-dev-api (766 kB)
```

<!-- _Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). -->

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Calling the `/hello` path with:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/hello
```

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```
