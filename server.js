var express = require("express");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 8080;
var fs = require("fs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var notes = [];

app.get("/notes", function (req, res) {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    console.log(data);
    notes = JSON.parse(data);
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  var newText = req.body;
  var id = notes.length;
  var noteObj = { ...req.body, id }
  notes.push(noteObj);
  fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
    if (err) { 
      console.log(err)
    }
    res.json(notes);
  });
});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(note => note.id !== parseInt(req.params.id));
    fs.writeFile('./db/db.json', JSON.stringify(notes),()=>{
      console.log("done");
      res.json(notes);
    }) 
  })





app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
