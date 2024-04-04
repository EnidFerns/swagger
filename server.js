const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const companyRoutes = require('./routes/companyRoutes');
const app = express();
const searchRouter = require('./Controllers/Search')

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use('/companies',companyRoutes)
app.use('/search',searchRouter)

async function intializeDatabase(){
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been eastablished Successfully !');
        await sequelize.sync({alter:true});

    } catch (error) {
        console.log("Unable to connect to the Database",error);
    }
}

intializeDatabase();

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

