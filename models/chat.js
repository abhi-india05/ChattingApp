const mongoose=require('mongoose');

const chatSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
},{timestamps:true}
);

const chatModel=new mongoose.Model('chat',chatSchema);

module.exports=chatModel;