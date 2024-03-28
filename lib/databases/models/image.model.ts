import {  Document, Schema, model, models } from "mongoose";

export interface IImage extends Document{
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string; 
    width?: number;
    height?: number;
    config?: object; 
    transformationURL?: string; 
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
    }
    createdat?: Date;
    updatedat?: Date;
  }
  




const imageschema= new Schema({
    title:{type: String, required: true},
    transformationType:{type: String, required: true},
    publicId:{type: String, required: true},
    secureURL:{type: String, required: true},
    width:{type: Number},
    height:{type: Number},
    config:{type: Object},
    transformationURL:{type: String},
    aspectRatio:{type: String},
    color:{type: String},
    prompt:{type: String},
   
    transformationratio:{type: String},
    author:{type: Schema.Types.ObjectId, ref: 'User'},
    createdat:{type: Date, default: Date.now},
    updatedat:{type: Date, default: Date.now}


})

const Image= models?.Image || model('Image', imageschema)
export default Image