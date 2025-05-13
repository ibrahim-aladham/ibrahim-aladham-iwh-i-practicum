const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';
const PROPERTIES = ["pet_name", "pet_age", "pet_type"];
const CUSTOM_OBJECT_NAME = "pets";
const propertiesParam = PROPERTIES.map(prop => `properties=${prop}`).join('&');

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const customObjectsUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}?${propertiesParam}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await axios.get(customObjectsUrl, { headers });
        const customObjects = response.data.results;
        res.render('home', { 
            title: 'Custom Objects | HubSpot APIs', 
            customObjects 
        });
    } catch (error) {
        console.error('Error fetching custom objects:', error);
        res.status(500).send('Error loading data');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const formData = {
        properties: {
            "pet_name": req.body.pet_name,
            "pet_age": req.body.pet_age,
            "pet_type": req.body.pet_type
        }
    };

    const url = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, formData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error);
        res.redirect('/update-cobj');
    }
});
app.listen(3000, () => console.log('Listening on http://localhost:3000'));