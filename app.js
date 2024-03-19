require('dotenv').config();
const app = require('express')();

app.use(require('express').json());
app.use(require('express').urlencoded({extended: true}));

const db = require('./models');
db.sequelize.sync()
.then(() => {
    console.log("Successfully connect to database");
})
.catch(err => {
    console.log(err.message);
})

app.use(require('./routes/UserRouter'));
app.use(require('./routes/MailRouter'));
app.use(require('./routes/FirebaseRouter'));

app.listen(process.env.PORT || 300, () => {
    console.log("Server is Running ---");
});