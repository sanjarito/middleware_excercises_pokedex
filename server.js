require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const POKEDEX = require('./pokedex.json')

app.use(morgan('dev'))
app.use(function validateBearerToken(req, res, next) {
   console.log('validate bearer token middleware')
   // move to the next middleware
   const authToken = req.get('Authorization')
   const apiToken = process.env.API_TOKEN

   if (!authToken || authToken.split(' ')[1] !== apiToken) {
     return res.status(401).json({ error: 'Unauthorized request' })
   }
  next()
 })


const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
  const pokemon_Name = req.query['name'].charAt(0).toUpperCase() + req.query['name'].slice(1)
  const pokemon_Type = req.query['type'].charAt(0).toUpperCase() + req.query['type'].slice(1)
  console.log(pokemon_Name)
  console.log(pokemon_Type)
  const pokemons = POKEDEX['pokemon']
  if (validTypes.includes(pokemon_Type)){
    const results2 = pokemons
    .filter(pokemon => pokemon.name == pokemon_Name)
    res.send(results2)

  } else {
    return res.status(404).json({ error: 'Type must be one of the following: Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`' })

  }








}

app.get('/pokemon',handleGetPokemon)

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
