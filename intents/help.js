const random = array => { return array[Math.floor(Math.random() * array.length)] }
const toText = message => { return { type: 'text', content: message } }
const toImage = image => { return { type: 'image', content: image } }

const getHelp = () => {
  const answers = [
    'Hello!',
    'Yo ;)',
    'Hey, nice to see you.',
    'Welcome back!',
    'Hi, how can I help you?',
    'Hey, what do you need?',
  ]
  return Promise.resolve([toText(random(answers))])
}

module.exports = getHelp