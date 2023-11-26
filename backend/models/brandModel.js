import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    image: [{
        type: String,
        required: true,
    }],
}, {
    timestamps: true,
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;