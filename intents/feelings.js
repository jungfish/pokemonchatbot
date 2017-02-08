const random = array => { return array[Math.floor(Math.random() * array.length)] }
const toText = message => { return { type: 'text', content: message } }
const toImage = image => { return { type: 'image', content: image } }

const getFeelings = () => {
  const answers = [
    'Feeling goog !',
    'I feel very nice thank you',
    'Splendid',
    'Great thank you',
    'Alright',
  ]
  return Promise.resolve([toText(random(answers))])
}

module.exports = getFeelings