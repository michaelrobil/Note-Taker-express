const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/'))

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {

    let noteData = fs.readFileSync('./assets/db.json');
    let savedNotes = JSON.parse(noteData);
    res.json(savedNotes);
});

app.post("/api/notes", function(req, res) {
    let currentNote = [];
    let newNote = {
        title: req.body.title,
        text: req.body.text,
    };
    let noteData = fs.readFileSync('./assets/db.json');
    try {
        var convertedData = JSON.parse(noteData)
        res.json(true);
    } catch (err) {
        var convertedData = {};
    }
    for (let i = 0; i < convertedData.length; i++) {
        currentNote.push(convertedData[i]);
    }
    currentNote.push(newNote);
    fs.writeFile('./assets/db.json', JSON.stringify(currentNote), function(err) {
        if (err) throw err;
    });
});

app.delete("/api/notes/:title", function(req, res) {
    let noteData = fs.readFileSync('./assets/db.json');
    try {
        var convertedData = JSON.parse(noteData)
        var chosenNote = convertedData.filter(note => note.title !== req.params.title)
        fs.writeFile('./assets/db.json', JSON.stringify(chosenNote), function(err) {
            if (err) throw err;
        });
    } catch (err) {
        var convertedData = {};
    }
    res.json(true);
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});