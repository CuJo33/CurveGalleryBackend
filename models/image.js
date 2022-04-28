
const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const ImageSchema = new Scheme({
    imageId: {
        type: ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: Buffer, // casted to MongoDB's BSON type: binData
        required: true
    }
});


module.exports = Image = mongoose.model("Image", ImageSchema);