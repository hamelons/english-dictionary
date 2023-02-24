// Task --- 1) Get data from API
// Task --- 2) Insert word into container (results-word)
// Task --- 3) Create sound btn on icon
// Task --- 4) Add container with results

let state = {
    word: '',
    meanings: [],
    phonetics: []
}

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

const input = document.getElementById('word-input')
const form  = document.querySelector('.form')
const containerWord = document.querySelector('.results-word')
const soundBtn = document.querySelector('.results-sound')
const resultList = document.querySelector('.results-list')
const resultWrapper = document.querySelector('.results')
const errorBlock = document.querySelector('.error')

const showError = (error) => {
    errorBlock.style.display = 'block'
    resultWrapper.style.display = 'none'
    errorBlock.innerText = error.message
}

const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example 
    ? `<div class="results-item__example">
            <p>Example:<span>${itemDefinition.definition}</span></p>
        </div>` 
    : ''

    return `<div class="results-item__definition">
                <p>${itemDefinition.definition}</p>
                ${example}
            </div>`
}

const getDefinition = (definition) => {
    return definition.map(renderDefinition).join('')
}

const renderItem = (item) => {
    return `<div class="results-item">
                <div class="results-item__part">${item.partOfSpeech}</div>
                <div class="results-item__definitions">
                ${getDefinition(item.definitions)}
                </div>
            </div>`
}

const showResults = () => {
    resultWrapper.style.display = 'block'
    resultList.innerHTML = ''
    state.meanings.forEach((item) => (resultList.innerHTML += renderItem(item)))
}

const insertWord = () => {
    containerWord.innerText = state.word
}

const handleSubmit = async (e) => {
    e.preventDefault()

    errorBlock.style.display = 'none'

    if (!state.word.trim()) return

    try {
        const response = await fetch(`${url} ${state.word}`)
        const data = await response.json()

        if(response.ok && data.length) {
            const item = data[0]

            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics
            }

            insertWord()
            showResults()
        } else {
            showError(data)
        }
    } catch (error) {
        console.log(err)
    }
}

const handleKeyup = (e) => {
    const value = e.target.value
    state.word = value
}

const handleSound = () => {
    if (state.phonetics.length) {
        const sound = state.phonetics[0]

        if(sound.audio) {
            new Audio(sound.audio).play()
        }
    }
}

input.addEventListener('keyup', handleKeyup)
form.addEventListener('submit', handleSubmit)
soundBtn.addEventListener('click', handleSound)