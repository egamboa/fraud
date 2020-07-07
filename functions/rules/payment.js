// Payment Rules
'use strict';

module.exports = (engine, constants) => {
  let self = {};
  engine.addRule({
    conditions: {
      any: [{
        fact: 'paymentAttempts',
        operator: 'greaterThanInclusive',
        value: 5
      }]
    },
    event: {
      type: constants.BLOCK_ACCESS,
      params: {
        message: 'blocked!'
      }
    }
  });

  engine.addRule({
    conditions: {
      all: [{
        fact: 'DateHour',
        operator: 'greaterThanInclusive',
        value: 3
      },
      {
        fact: 'DateHour',
        operator: 'lessThanInclusive',
        value: 6
      }]
    },
    event: {
      type: constants.FRICTION,
      params: {
        message: 'not common buying hours!'
      }
    }
  });

  self.index = (req, res) => {
      let d = new Date(0);
      d.setUTCSeconds(req.body.started_date)
      req.body.DateHour = d.getHours();
      engine
      .run(req.body)
      .then(results => {
        console.log(results);
        res.send(results.events);
        return;
      }).catch( error => console.log('error :>> ', error));
  };

  return self;
};
