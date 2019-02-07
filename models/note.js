var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var NoteSchema = new Schema({
  label: String,
  body: String
});

var Note = mongoose.model("note", NoteSchema);

module.exports = Note;