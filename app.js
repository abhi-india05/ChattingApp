const express=require('express');
const {v4:uuidv4}=require("uuid");
const app=express();
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const session=require('express-session');
const {getUser,setUser}=require('./map.js');

main().then(() => {
    console.log("connected to DB ");
}).catch(err => {
    console.log(err);
});

const {userModel:User}=require('./models/user.js');
const {chatModel:Chat}=require('./models/chat.js');


//Creating a database 
async function main () {
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
    
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60 *60*1000,
        maxAge :  7*24*60 *60*1000,
        httpOnly : true,
    }
    
};


app.use(session(sessionOptions));


app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.post('/signup',async(req,res)=>{
    let {name,username,password,email}=req.body;
    try{
    const newUser=new User({name:name,username:username,password:password,email:email});
    await User.register(newUser,password);

    
        let newid=uuidv4();
       setUser(newid,newUser);
    }
catch(error){
    console.log("error occured:"+error);
}});
    

    


app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',passport.authenticate("local",{failureRedirect:'/login'}),(req,res)=>{
    let username=req.body.username;
res.redirect(`/user/:${username}`)
});

const isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()) next();
    else res.redirect('/login');
}
app.get('/user/:username',isAuthenticated,async(req,res)=>{
    const username=req.params.username;
    const arr=await User.find().where('from').equals(username);
    res.render('UserHomePage',{arr});
});

app.get('/user/:username/chat', async (req, res) => {
    const { id } = req.query; 
    const user = req.params.username; 
    try {
        if (!id) {
            console.log("ID is missing in query parameters");
            return res.status(400).send("Chat ID is required");
        }

        
        const sender = await getUserByUserName(user);
        if (!sender) {
            console.log(`Sender with username '${user}' not found`);
            return res.status(404).send("Sender not found");
        }

       
        const receiver = getUser(id);
        if (!receiver) {
            console.log(`Receiver with ID '${id}' not found`);
            return res.status(404).send("Receiver not found");
        }

        
        const chat = await Chat.find({ from: sender.username, to: receiver.username });

        
        res.render('UserChatPage', { chat });
    } catch (error) {
        console.error("An error occurred while fetching chat data:", error);
        res.status(500).send("Internal Server Error");
    }
});


async function getUserByUserName(username){

   try{
    requiredUser=await Chat.find({username});
    return requiredUser;
   }
    catch(error){
        console.log("error occured at getUserByUserName function:"+error);
        return null;
    }
    
}

app.post('/user/:username/chat',async(req,res)=>{
    let userName=req.params.username;
    
    let{t}=req.query;
    let{content}=req.body;
    let u1=getUser(t);
    try{
    let newChat=new Chat({from:userName,to:u1.username,content:content});
    await newChat.save();
    res.redirect('/user/:username/chat');
    }
    catch(err){
        console.log("Error saving chat");
        res.status(500).error(err);
    }


});
