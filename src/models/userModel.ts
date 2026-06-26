import mongoose, { Schema } from "mongoose";

const userSchema= new Schema({
   avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/200x200`,
        localPath: "",
      },
    },
    username:{
        type:String,
        required:[true, "Please provide a username"],
        unique:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:[true, "Please provide a email"],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
