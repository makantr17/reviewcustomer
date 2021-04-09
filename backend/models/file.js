import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    prevPath: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    file_path: {
      type: String,
      required: true
    },
    typeSubmitted: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;