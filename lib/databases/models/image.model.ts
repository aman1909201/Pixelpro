import {  Document, Schema, model, models } from "mongoose";

export interface Image extends Document{
    title: String;
    transformationtype: String;
    publicid: String,
    secureurl: URL,
    width: number,
    height: number,
    color: String,
    prompt: String,
    aspectratio: String,
    creditfee: number,
    credit: String,
    transformationration: String,
    author: {
        _id: String,
        firstname: String,
        lastname:String
    }
    createdat?: Date
    updatedat?: Date


}

const imageschema= new Schema({
    title:{type: String, required: true},
    transformationtype:{type: String, required: true},
    publicid:{type: String, required: true},
    secureurl:{type: URL, required: true},
    width:{type: Number},
    height:{type: Number},
    config:{type: Object},
    transformationurl:{type: URL},
    aspectratio:{type: String},
    color:{type: String},
    prompt:{type: String},
    credit:{type: String},
    creditfee:{type: Number},
    transformationratio:{type: String},
    author:{type: Schema.Types.ObjectId, ref: 'User'},
    createdat:{type: Date, default: Date.now},
    updatedat:{type: Date, default: Date.now}


})

const Image= models?.Image || model('Image', imageschema)
export default Image