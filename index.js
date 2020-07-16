const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
// allow us to use "fetch()" on the server
const app = express();
app.listen(3000, () => 
    console.log('Starting server at http://localhost:3000')
);
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({},(err, data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    database.insert(data);
    response.json(data);
});

app.get('/location/:city', async(request, response) => {
    const city = request.params.city;
    const location_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8f5d916cc4ea5932c371a57de5dc6c81`;
    const location_response = await fetch(location_url);
    const location = await location_response.json();
    response.json(location);
});