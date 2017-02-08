const random = array => { return array[Math.floor(Math.random() * array.length)] }
const toText = message => { return { type: 'text', content: message } }
const toImage = image => { return { type: 'image', content: image } }

const getGreetings = (entity,reply) => {

  return Promise.resolve([toText(reply)])
}

module.exports = getGreetings