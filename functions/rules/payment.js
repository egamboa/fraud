// Payment Rules
'use strict';

module.exports = (engine) => {
  let self = {};


  //let engine = new Engine()

  // define a rule for detecting the player has exceeded foul limits.  Foul out any player who:
  // (has committed 5 fouls AND game is 40 minutes) OR (has committed 6 fouls AND game is 48 minutes)
  engine.addRule({
    conditions: {
      any: [{
        all: [/*{
          fact: 'gameDuration',
          operator: 'equal',
          value: 40
        },*/ {
          fact: 'paymentAttempts',
          operator: 'greaterThanInclusive',
          value: 5
        }]
      }/*, {
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 48
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 6
        }]
      }*/]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
      type: 'fouledOut',
      params: {
        message: 'blocked!'
      }
    }
  })


  self.index = (req, res) => {
    //req.body <==
    //engine.
    /*
    * 1 membership will be flag as suspicious if has more than 3 payment attempts.
        * { membId: 12345, paymentAttempts: 3 } -> flagged
    * 1 new membership cannot be pay more than 5 times in 48 hours.
        * { membId: 12345, paymentAttempts: 5 } -> blocked
    */
    engine
    .run(req.body)
    .then(results => {
      console.log(results);
      res.send(results.events);
    })
    //res.send('algo');
  };

  return self;
};