const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

try {
    mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp' , { useNewUrlParser: true, useUnifiedTopology: true})
    console.log('MONGO CONNECTION OPEN');
  } catch (error) {
console.log('UPS, MONGO CONNECTION ERROR')
console.error(error);
}

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 20) + 10;

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '63d95e44bf252617ac4d0e6e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwntaafwj/image/upload/v1675431541/YelpCamp/x6xhismskfyw02n2psyc.jpg',
                    filename: 'YelpCamp/x6xhismskfyw02n2psyc'
                },
                {
                    url: 'https://res.cloudinary.com/dwntaafwj/image/upload/v1675353753/YelpCamp/rv8ao6xqmyfkcjwyxzew.jpg',
                    filename: 'YelpCamp/rv8ao6xqmyfkcjwyxzew'
                },
                {
                    url: 'https://res.cloudinary.com/dwntaafwj/image/upload/v1675352690/YelpCamp/fzwggctioc3ozromtluu.jpg',
                    filename: 'YelpCamp/fzwggctioc3ozromtluu'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})