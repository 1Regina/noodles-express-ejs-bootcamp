import express from 'express';
import {add, read} from './jsonFileStorage.js';

const app = express();
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));

const port = 3004

const whenIncomingResIndex = (request, response) => {
  console.log(`request came in`, request.body)

  read(`data.json`, (readErr, jsonContentObj) => {
      if (readErr) {
        console.error(`ReadError`, readErr)
        response.send('ERROR')
      } else {
        console.log(request.params)
        let index = request.params.index
        console.log(`index`, typeof index, index)
        const recipe = jsonContentObj.recipes[index]; 
        console.log('aaaa');
        if (recipe) {
          response.send(recipe)
        } else {
          response.status(404).send('Sorry, we cannot find that!');
        }
    }

  })
}


const getYieldPortion = (request, response) =>{
  console.log(`request came in`, request.body)

  read(`data.json`, (readErr, jsonContentObj) => {
    if(readErr){
      console.error(`ReadError`, readErr)
      response.send('ERROR')
    } else {
      console.log(request.params)
      let portion = parseInt(request.params.index)
      console.log(`index`, typeof portion, portion)
      const recipesMatchingYield = jsonContentObj.recipes.filter(element => element.yield === portion )
      response.send(recipesMatchingYield)
    }
  })
}


app.get('/recipe/:index', whenIncomingResIndex)
app.get(`/yield/:index`, getYieldPortion)

// with EJS
const whenIncomingRequest = (req, res) => {
  console.log('request  came in', req.body);

  read('data.json', (err, dataObj) => {
    if (err) {
      console.log('read error', err);
      response.send('ERROR');
    } else {
      const { recipes } = dataObj; // extract the array value with recipes key
      res.render('index', { recipes });
    }
  });
};
app.get('/', whenIncomingRequest);

const whenIncomingRequestIndex = (req, res) => {
  console.log('request came in ');

  read('data.json', (error, dataObj) => {
    if (error) {
      console.log('read error', error);
    }

    const { index } = req.params;

    const recipe = dataObj.recipes[index];
    // console.log(recipe);

    res.render('recipe', { recipe });
  });
};


app.get('/recipes/:index', whenIncomingRequestIndex);
app.listen(port)