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
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter : 24 *3600,
    
});
store.on("error",() => {
    console.log("ERROR in mongo session store",err);
});

const sessionOptions = {
    store,
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
//app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.post('/signup',async(req,res)=>{
    let {name,username,password,email}=req.body;
    const newUser=new User({name:name,username:username,password:password,email:email});
    await User.register(User,password);

    await newUser.save().then(()=>{
        let newid=uuidv4();
       setUser(newid,newUser);
    });

    
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login',passport.authenticate("local",{failureRedirect:'/login'}),(req,res)=>{
    let username=req.body.username;
res.redirect('/user/:${username}')
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

app.get('/user/:username/chat',async(req,res)=>{
    let {id}=req.query;
    let user=req.params.username;
    let sender=getUserByUserName(user);
    if(!id) console.log("some error occurred");
    else{
        const receiver=getUser(id);
        const chat=await Chat.find().where('from','to').equals(sender.username,receiver.username);
    }
    res.render('UserChatPage',{chat});
});

async function getUserByUserName(username){
    let requiredUser=await User.find().where('username').equals(user).then(()=>{}).catch(err=>console.error(err));
    if(requiredUser) return requiredUser;
    console.log("error occured when fetching data from database");

}

app.post('/user/:username/chat',async(req,res)=>{
    let userName=req.params.username;
    
    let{t}=req.query;
    let{content}=req.body;
    let u1=getUser(t);
    let newChat=new Chat({from:userName,to:u1.username,content:content});
    await newChat.save();
    res.redirect('/user/:username/chat');


});
