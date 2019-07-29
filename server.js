require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const POKEDEX = require('./pokedex.json')
const helmet = require('helmet
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())
app.use(function validateBearerToken(req, res, next) {

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

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {

})
