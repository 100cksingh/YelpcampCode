if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

// require('dotenv').config();

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)
   
const express=require('express');
const path=require('path')
// const app=express();
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
// const Joi=require('joi');
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const helmet=require('helmet') 
// const { findByIdAndDelete } = require('./models/campground');

const mongoSanitize = require('express-mongo-sanitize');
const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});



const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

// const validateCampground=(req,res,next)=>{
//         const campgroundSchema=Joi.object({
//         campground:Joi.object({
//             title:Joi.string().required(),
//             price:Joi.number().required().min(0),
//             image:Joi.string().required(),
//             location:Joi.string().required(),
//             description:Joi.string().required()
//     }).required()
// })
// const {error}=campgroundSchema.validate(req.body);
// if(error){
//     const msg=error.details.map(el=>el.message).join(',')
//     throw new ExpressError(msg,400)
// }else{
//     next();
// }
// }

// const validateReview=(req,res,next)=>{
//     const{error}=reviewSchema.validate(req.body);
//     if(error){
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new ExpressError(msg,400)
//     }else{
//         next();
//     }
// }

app.use(mongoSanitize({
    replaceWith: '_',
}
));
const sessionConfig={
    name:'pk',
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookies:{
        httpOnly:true,
        secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet());
// app.use(helmet({contentSecurityPolicy:false}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyfld3kte/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // if(!['/login','/'].includes(req.originalUrl)){
    //     // console.log(req.originalUrl);
    //     req.session.returnTo=req.originalUrl;
    // }
    console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
//Updated code below 
// app.use((req,res,next)=>{
//     if(!['/login','/'].includes(req.originalUrl)){
//         // console.log(req.originalUrl);
//         req.session.returnTo=req.originalUrl;
//     }
//     res.locals.currentUser=req.user;
//     res.locals.success=req.flash('success');
//     res.locals.error=req.flash('error');
//     next();
// })



// app.get('/fakeUser',async(req,res)=>{
//     const user=new User({email:'chandra@gmail.com',username:'chandra'})
//     const newUser=await User.register(user,'chicken');
//     res.send(newUser);
// })


app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home')
});
// app.get('/makecampground',async(req,res)=>{
//   const camp=new Campground({title:'My Backyard',description:'cheap camping!'});
//   await camp.save();
//   res.send(camp)
// })

// app.get('/campgrounds',catchAsync(async(req,res)=>{
//     const campgrounds=await Campground.find({});
//     res.render('campgrounds/index',{campgrounds})
// }));

// // app.post('/campgrounds',async(req,res)=>{
// //     res.send(req.body);
// // })
// app.get('/campgrounds/new',(req,res)=>{
//     res.render('campgrounds/new');
// });
// app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{
//       // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
// //     const campgroundSchema=Joi.object({
// //         campground:Joi.object({
// //             title:Joi.string().required(),
// //             price:Joi.number().required().min(0),
// //             image:Joi.string().required(),
// //             location:Joi.string().required(),
// //             description:Joi.string().required()
// //     }).required()
// // })
// // const {error}=campgroundSchema.validate(req.body);
// // if(error){
// //     const msg=error.details.map(el=>el.message).join(',')
// //     throw new ExpressError(msg,400)
// // }
// // console.log(result);
//     const campground=new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.get('/campgrounds/:id',catchAsync(async(req,res,)=>{
//     const campground=await Campground.findById(req.params.id).populate('reviews');
//     res.render('campgrounds/show',{campground});
// }));
// app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
//     const campground=await Campground.findById(req.params.id)
//     res.render('campgrounds/edit',{campground});
// }))
// app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
//     // res.send("IT WORKED!!")
//     const {id }=req.params;
//    const campground =await Campground.findByIdAndUpdate(id,{...req.body.campground});
//    res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
//     const {id}=req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }));

// app.post("/campgrounds/:id/reviews",validateReview, catchAsync(async(req,res)=>{
// const campground=await Campground.findById(req.params.id);
// const review=new Review(req.body.review);
// campground.reviews.push(review);
// await review.save();
// await campground.save();
// res.redirect(`/campgrounds/${campground._id}`);
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{
//     const {id,reviewId}=req.params;
//    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//    await Review.findByIdAndDelete(reviewId);
//    res.redirect(`/campgrounds/${id}`);
// }));


app.all('*',(req,res,next)=>{
    // res.send("404!!!!")
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    // res.status()
    // res.send('Oh boy, something went wrong!')
    const {statusCode=500}=err;
    if(!err.message)err.message='oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log('Serving on port 3000')
})


