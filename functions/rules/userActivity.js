// User activity Rules
'use strict';

module.exports = (engine) => {
  let self = {};

  self.index = (req, res) => {
    //engine.
    res.send('algo');
  };

  return self;
};
