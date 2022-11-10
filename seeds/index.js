
const mongoose=require('mongoose');
const cities=require('./cities');
const { places,descriptors }=require('./seedHelpers');
const Campground=require('../models/campground');

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

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'631436418dce093af9a47d52',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251/1600x900',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit tempore accusantium commodi harum aspernatur, quibusdam praesentium deserunt doloremque optio error nisi eligendi iure dolorum ea exercitationem. Fugiat sequi esse sunt.',
            price,
            geometry:{
                type:"Point",
                // coordinates: [ 77.187293, 32.245461 ] //for any country map locatin camps.
                coordinates: [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ] 
            },
            images:[
                {
                        url: 'https://res.cloudinary.com/dyfld3kte/image/upload/v1666593165/YelpCamp1/kopbs9c9h24txum2ynwd.jpg',
                        filename: 'YelpCamp1/idipivrlusxteil0a07b'
                      },
                  {
                        url: 'https://res.cloudinary.com/dyfld3kte/image/upload/v1666593049/YelpCamp1/uxyiauqmlth8euce2pkx.jpg',
                        filename: 'YelpCamp1/skpaqugkqht6ip41tojg'
                      } 
            ]
        })
        await camp.save();
    }
    // const c=new Campground({title:'purple field'});
    // await c.save();
}

seedDB().then(()=>{ // this command automatically disconnect server after connection 
    mongoose.connection.close()
})