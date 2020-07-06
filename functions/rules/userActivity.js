// User activity Rules
'use strict';

const {constants} = require('./constants');

module.exports = (engine) => {
  let self = {};

 /* 
  * Flag as suspicious if a login occurs outside of the membership user's location.
    * { membId: 12345, region: OK, City: FL, attempt_region: CO, attempt_city: Denver } -> flagged
  * If the user fails to login more than 2 times it adds friction.
    * { membId: 12345, region: OK, City: FL, attempts: 3, attempt_region: CO, attempt_city: Denver } -> friction
 */
  engine.addRule({
    name: 'Login location',
    conditions: {
      any: [
        {
          fact: 'region',
          operator: 'notEqual',
          value: {
            fact: 'attempt_region'
          }
        },
        {
          fact: 'city',
          operator: 'notEqual',
          value: {
            fact: 'attempt_city'
          }
        }
      ]
    },
    event: {
      type: constants.SUSPECT,
      params: {
        message: `login occurs outside of the membership user's location!`
      }
    }
  });

  engine.addRule({
    name: 'Login attempts',
    conditions: {
      all: [
        {
          fact: 'attempts',
          operator: 'greaterThan',
          value: 2
        }
      ]
    },
    event: {
      type: constants.FRICTION,
      params: {
        message: `multiple login attempts`
      }
    }
  });

  self.index = (req, res) => {
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
