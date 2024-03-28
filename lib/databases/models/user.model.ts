import { Schema, model, models } from "mongoose";

const userschema= new Schema({
    clerkId:{type:String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    username:{type: String, required: true, unique: true},
    photo:{type: String, required: true},
    firstname:{type:String},
    lastname:{type: String},
    planid:{type: Number, default:1}
    
})

const User= models?.User || model('User', userschema)
export default User