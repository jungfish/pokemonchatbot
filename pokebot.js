
const getGreetings = require('./intents/greetings.js')
const getFeelings = require('./intents/feelings.js')
const getGoodbyes = require('./intents/goodbyes.js')
const getHelp = require('./intents/help.js')
const getInfoPokemon = require('./intents/infopokemon.js')
const getMovePokemon = require('./intents/movepokemon.js')
const getStatPokemon = require('./intents/statpokemon.js')
const datas = require('./datas.js')
const Fuzzy = require('fuzzy-matching')

const config = require('./config.js')
const restify = require('restify')
const builder = require('botbuilder')
const u = require('./utils.js')

// Connection to Microsoft Bot Framework
const connector = new builder.ChatConnector({
  appId: config.appid,
  appPassword: config.secret,
})

const bot = new builder.UniversalBot(connector)

const recast = require('recastai')
const recastClient = new recast.Client(config.recast)

const noMemoryIntents = [
  'help',
  'greetings',
  'goodbyes',
  'feelings',
]

const INTENTS = {
  greetings: getGreetings,
  feelings: getFeelings,
  help: getHelp,
  goodbyes: getGoodbyes,
  infopokemon: getInfoPokemon,
  movepokemon: getMovePokemon,
  statpokemon: getStatPokemon,
}

const fmpokemons = new Fuzzy(datas.pokemons)

const checkEntity = (recast) => {
  const pokemon = recast.raw.entities["pokemon"] ? recast.raw.entities["pokemon"][0] : null
  console.log("entity "  + JSON.stringify(pokemon))
  if (pokemon) {
    const match = fmpokemons.get(pokemon.raw)
    if (match.distance < 0.8) {
      pokemon.wrong = true
    } else { pokemon.raw = match.value }
    return pokemon
  }
  return null
}

const checkWords = (words) => {
  const split = words.split(' ')
  let entity = null
  split.forEach((word) => {
    const match = fmpokemons.get(word)
    if (match.distance > 0.8) {
      entity = {raw: match.value}
    }
  })
  return (entity)
}

const sendMessageByType = {
  image: (session, elem) => session.send(new builder.Message().addAttachment({
    contentType: 'image/png',
    contentUrl: elem.content,
  })),
  text: (session, elem) => session.send(elem.content),
    buttons: (session, elem) => {
    const buttons = elem.content.map(button => {
      return (new builder.CardAction().title(button.title).type('imBack').value(button.value))
    })
    const card = new builder.ThumbnailCard().buttons(buttons).subtitle(elem.title)
    session.send(new builder.Message().addAttachment(card))
  }
}


// Event when Message received
bot.dialog('/', (session) => {
  recastClient.textConverse(session.message.text)
  .then(res => {
      console.log(JSON.stringify(res));
    let intent = res.intents[0]
    let entity =  checkEntity(res)
    let user = session.userData
    if (!intent) {
      if (!entity) { entity = checkWords(u.cleanText(res.source)) }
      if (entity) {
        intent = {}
        intent.slug = user.intent
        }
    }
    
    if (intent && noMemoryIntents.indexOf(intent.slug) === -1) { user.intent = intent.slug }
    if (intent)  {
    	console.log("intent.slug " + intent.slug)
    	console.log("entity  " + JSON.stringify(entity))
    	console.log("user Data " + JSON.stringify(user))
      INTENTS[intent.slug](entity, res.reply(), session.userData)
       .then(res => { res.forEach((message) => sendMessageByType[message.type](session, message)) })
       .catch(err => { err.forEach((message) => sendMessageByType[message.type](session, message)) })
    } })
  .catch((err) => {
       // handle the error safely
      console.log(err) 
      session.send('I need some sleep right now... Talk to me later!')               
  })
})



// Server Init
const server = restify.createServer()
server.listen(8080)
server.post('/', connector.listen())
