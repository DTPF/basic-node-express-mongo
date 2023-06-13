const { Schema, model } = require('mongoose');

const ModelSchema = new Schema({
  key: String,
}, {
  timestamps: true,
});

const ModelModel = model('Model', ModelSchema);

module.exports = ModelModel;
