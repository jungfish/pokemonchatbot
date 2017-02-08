const request = require('superagent')
const u = require('../utils.js')

const movePokemonLayout = (json) => {
      console.log(json.moves)
   const answer = []
   // Fill answer
   return(answer)
 }


 const getMovePokemon = (entity, reply, user) => {
     const pokemon = entity ? entity.raw : user.pokemon
     if (!pokemon) { return Promise.reject([u.toText('Which pokemon?')]) }
     user.pokemon = pokemon
     
     return new Promise(
        function(resolve, reject) {
        request.get('https://pokeapi.co/api/v2/pokemon/' + pokemon)
        .end((err, res) => {
          if (err) { return reject('ERROR') }
          resolve(movePokemonLayout(res.body))

    })
  })
 .catch((err) => {
       // handle the error safely
      console.log(err) 
      session.send('I need some sleep right now... Talk to me later!')               
  })
}
 
 

 module.exports = getMovePokemon