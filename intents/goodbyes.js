const random = array => { return array[Math.floor(Math.random() * array.length)] }
const toText = message => { return { type: 'text', content: message } }
const toImage = image => { return { type: 'image', content: image } }

const getGoodbyes = () => {
  const answers = [
    'See ya !',
    'See you',
    'Bye',
    'Bye nice talking :)',
    'I\'ll see you in my dreams' ,
    'Aurevoir',
  ]
  return Promise.resolve([toText(random(answers))])
}

module.exports = getGoodbyes