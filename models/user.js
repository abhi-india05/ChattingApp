const mongoose=require('mongoose');
const passportlocalmongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportlocalmongoose);
const userModel=new mongoose.model('user',userSchema);
module.exports=userModel;