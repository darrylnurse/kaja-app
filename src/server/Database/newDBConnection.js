const http = require("http");
const pgp = require("pg-promise")();//needs to be like this as we are initializing without options
const connectionString = `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER_HOST}:${process.env.DB_SERVER_PORT}/${process.env.DB_NAME}`;
const api = require('api')('@yelp-developers/v1.0#9nl412lo4fa3f9');
const db = pgp(connectionString); //we need some sort of connection as the parameter 


const Sequelize = require('sequelize');
//const sequelize = new Sequelize(connectionString); //we probably don't need this here

//import the models
const Business = require("./models/Business"); 
const Location = require('./models/Location');
const Type = require('./models/Type');

const models = {business: Business, location: Location, type: Type}
const apiKey = `Bearer ${process.env.YELP_API_KEY}`;//setting the API key


const query = {
    location: 'New%20York%20City',
    term: 'food%2C%20entertainment%2C%20hangout%2C%20fun', 
    sort_by: 'distance', 
    limit: '50' // 50 is the max
};

api.auth(apiKey); //authenticate with Bearer apikey

//here we want to recieve the imports of the models so that we can sync and seed them.
const BUSINESS = Array.from({length: 50}, () => (
    {
        business_id: "", 
        business_name:"",
        business_url:"",
        business_reviews: 0, 
        business_rating: 0.0, 
        business_price: "", 
        business_address: ["", ""],
    }
))

const LOCATION = [{
    location: decodeURIComponent(query.location)
}];

const TYPE = [{
    business_id: "TESTING AGAIN", 
    type: query.term.split("%2C%20") //will hold the 
}];


//check if phone and image are null....
api.v3_business_search(query)
                        .then(({data}) => data.businesses)
                        .then(processed => {
                            for(i = 0; i < BUSINESS.length; i++){
                                BUSINESS[i].business_id = processed[i].id;
                                if(processed[i].image_url.length){
                                    BUSINESS[i].business_image = processed[i].image_url
                                }
                                BUSINESS[i].business_name = processed[i].name;
                                BUSINESS[i].business_url = processed[i].url;
                                BUSINESS[i].business_reviews = processed[i].review_count;
                                BUSINESS[i].business_rating = processed[i].rating;
                                BUSINESS[i].business_price = processed[i].price; //price can be null
                                BUSINESS[i].business_address = processed[i].location.display_address;
                                if(processed[i].display_phone.length){
                                    BUSINESS[i].business_phone = processed[i].display_phone
                                }
                                BUSINESS[i].business_phone = processed[i].display_phone
                            }
                        })
                        .catch(err => console.error(err));



(async () => {
    Location.hasMany(Business, {foreignKey: 'location_id'});//one to many relation with business and location
    Business.belongsTo(Location);  
    for(let model in models){
        try{
            await models[model].sequelize.sync({force: true}) //we don't really want to do this destructive behavior
        }
        catch(err){
            console.error(err);
        }
    }
    //we have to make the relations here 
    try{
        await TYPE.map((t) => {Type.create(t)});
        await LOCATION.map((b) => {Location.create(b)}); //for some reason something isn't working on the business model...
        await Business.bulkCreate(BUSINESS);
    }catch(err){
        console.error(err)
    }
})();



/*
      id: 'pIjZw5yZQQg7XX4kUiqtgw',
      name: 'Alamo Drafthouse Cinema Lower Manhattan',
      image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/ybJEMrBEbCwcMt0Jcb2M7w/o.jpg',
      url: 'https://www.yelp.com/biz/alamo-drafthouse-cinema-lower-manhattan-new-york?adjust_creative=o2R38fORawk4CuPMZJOCUg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=o2R38fORawk4CuPMZJOCUg',
      review_count: 101,
      rating: 4,
      location: [Object],  --> location.display_address
      display_phone: '',
*/











 

module.exports = {db, models}; //export db so that it can be used in other endpoints

