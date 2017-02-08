const request = require('superagent')

const u = require('../utils.js')
 
 const infoPokemonLayout = json => {
  const answer = [u.toText(`:mag_right: ${json.name} infos`)]
  const toAdd = json.types.map(elem => elem.type.name).join(' / ')
  answer.push(u.toText(`Type(s): ${toAdd}`))
  if (json.sprites.front_default) { 
  	answer.push(u.toImage(json.sprites.front_default)) 
  }
     
     const prompt = [
     u.toButton('stats', `show me ${json.name} stats`),
     u.toButton('moves', `show me ${json.name} moves`),
   ]
     
    answer.push(u.toButtons('More info here', prompt))
  return answer
}
 
const getInfoPokemon = (entity, reply, user) => {
    const pokemon = entity ? entity.raw : user.pokemon
    if (!pokemon) { return Promise.reject([u.toText('Which pokemon?')]) }
    if (entity.wrong) { return Promise.reject([u.toText(`The pokemon ${entity.raw} does not exist... You might have mispelled it.`)]) }
    user.pokemon = pokemon
    
    return new Promise(
  	 function(resolve, reject) {
        request.get('https://pokeapi.co/api/v2/pokemon/' + pokemon)
        .end((err, res) => {
            if (err) { return reject('ERROR') }
            resolve(infoPokemonLayout(res.body))
        })
    })
	.catch(() => session.send('I need some sleep right now... Talk to me later!'))
}
module.exports = getInfoPokemon