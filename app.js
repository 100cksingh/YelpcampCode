const express=require('express');
const path=require('path')
// const app=express();
const mongoose=require('mongoose');
const Campground=require('./models/Campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});
const app=express();


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

// app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('home');
})
// app.get('/makecampground',async(req,res)=>{
//   const camp=new Campground({title:'My Backyard',description:'cheap camping!'});
//   await camp.save();
//   res.send(camp)
// })
app.get('/campgrounds',async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
});

// app.post('/campgrounds',async(req,res)=>{
//     res.send(req.body);
// })
app.get('/camgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.get('/campgrounds/:id',async(req,res,)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
});


app.listen(3000,()=>{
    console.log('Serving on port 3000')
})

