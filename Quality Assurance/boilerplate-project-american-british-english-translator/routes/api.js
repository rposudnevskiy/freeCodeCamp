'use strict';

const Translator = require('../components/translator.js');

module.exports = function(app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      //console.log('--- /api/translate - POST ---');
      //console.log(req.body)

      if (req.body.hasOwnProperty('text') && req.body.hasOwnProperty('locale')) {
        if (req.body.text) {
          if (req.body.locale == 'american-to-british') {
            return res.json({ text: req.body.text, translation: translator.american2british(req.body.text) })
          } else if (req.body.locale == 'british-to-american') {
            return res.json({ text: req.body.text, translation: translator.british2american(req.body.text) });
          } else {
            return res.json({ error: 'Invalid value for locale field' })
          }
        } else {
          return res.json({ error: 'No text to translate' });
        }
      } else {
        return res.json({ error: 'Required field(s) missing' });
      }
    });
};
