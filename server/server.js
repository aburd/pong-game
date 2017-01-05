var express = require('express')
var path = require('path')

var app = express();

var port = process.env.PORT || 3000

app.use(express.static(path.resolve(__dirname, '../dist')))

app.use('/', function(req, res){
  res.sendFile(path.resolve(__dirname, '../client/index.html'))
})

app.listen(port, function(){
  console.log('Application is listening on port', port)
})
