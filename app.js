'use strict';

const express = require('express');
const app = express();
const projectId = 'fabp-149215'; //replace with your own google cloud project id
const Language = require('@google-cloud/language');
app.use(express.bodyParser());

const languageClient = Language({
  projectId: projectId
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function(req, res) {
  let analysis = languageClient.detectSentiment('Please enter text for analysis. Thanks!', { verbose: true }, (err, sentiment) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json({"text": 'Please enter text for analysis. Thanks!', "polarity": sentiment.polarity, "magnitude": sentiment.magnitude});
  });
});

app.post('/', function(req, res) {
  let doc = languageClient.document(req.body.userText);
  doc.encodingType = 'UTF16';
  doc.annotate({verbose: true}, function (err, annotations) {
    if (err) {
      console.error(err);
      return;
    }
    // console.log(annotations.entities.people[0]);
    annotations.submittedText = req.body.userText;
    res.send(annotations);
  });
});

app.listen(process.env.PORT || 9000);
