var express = require('express');
var cors = require('cors');
require('dotenv').config();

const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

const fs = require('fs')

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//---------------------------------------------

// Enable request logging
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// Upload file:
// POST /api/fileanalyse
// return {"name":"package.json","type":"application/json","size":531}
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res, next) {

  filemeta = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err)
      return
    }
    //Uploaded file removed
  });
  
  res.json(filemeta);
});
//---------------------------------------------


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
