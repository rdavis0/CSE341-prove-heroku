const path = require('path');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')

const PORT = process.env.PORT || 3000; // So we can run on heroku || (OR) localhost:5000


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("61ff2a719f4332bb8090c09d")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const corsOptions = {
    origin: "https://cse341-rd.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://rdavis:mvxezSmZb1wSWUR1@cluster0.pbeyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(
        MONGODB_URL, options
    )
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Ryan',
                    email: 'email@example.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    })