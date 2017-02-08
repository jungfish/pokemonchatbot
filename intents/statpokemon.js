const request = require('superagent')
const u = require('../utils.js')

const statPokemonLayout = (json,pokemon) => {
   
   const toAdd = json.stats.map(elem => elem.stat.name + " " + elem.base_stat).join(' / ')
   const answer = []
   answer.push(u.toText(`Stats of ${pokemon}: ${toAdd}`))
   // Fill answer
   return(answer)
 }

 const getStatPokemon = (entity, reply, user) => {
    const pokemon = entity ? entity.raw : user.pokemon
    if (!pokemon) { return Promise.reject([u.toText('Which pokemon?')]) }
    user.pokemon = pokemon
     
      return new Promise(
        function(resolve, reject) {
        request.get('https://pokeapi.co/api/v2/pokemon/' + pokemon)
        .end((err, res) => {
          if (err) { return reject('ERROR') }
          resolve(statPokemonLayout(res.body,pokemon))

        })
  })
	.catch((err) => {
       // handle the error safely
      console.log(err) 
      session.send('I need some sleep right now... Talk to me later!')               
  })
}
 
 
  

 
  module.exports = getStatPokemon