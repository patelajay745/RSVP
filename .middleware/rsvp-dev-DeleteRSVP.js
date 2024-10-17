'use strict';
    
const middleware_auth = require('../middleware/auth.js');
const handlers_event_deleteRSVP = require('../handlers/event/deleteRSVP.js');

module.exports.handler = async (event, context) => {
  let end = false;
  context.end = () => end = true;

  const wrappedHandler = handler => prev => {
    if (end) return prev;
    context.prev = prev;
    return handler(event, context);
  };

  return Promise.resolve()
    .then(wrappedHandler(middleware_auth.authenticate.bind(middleware_auth)))
    .then(wrappedHandler(handlers_event_deleteRSVP.handler.bind(handlers_event_deleteRSVP)));
};