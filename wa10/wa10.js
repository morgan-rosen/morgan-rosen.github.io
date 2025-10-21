const newQuoteButton = document.querySelector('#js-new-quote');
const showAnswerButton = document.querySelector('#js-tweet');
const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

const endpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

newQuoteButton.addEventListener('click', getQuote);
showAnswerButton.addEventListener('click', showAnswer);

let currentAnswer = '';

async function getQuote() {
  console.log('Button clicked! Getting a new quote...');

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log(data);

    displayQuote(data.question);
    currentAnswer = data.answer;
    answerText.textContent = ''; 
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Failed to fetch quote. Please try again later.');
  }
}

function displayQuote(quote) {
  quoteText.textContent = quote;
}

function showAnswer() {
  if (currentAnswer) {
    answerText.textContent = currentAnswer;
  } else {
    answerText.textContent = 'Click "Generate a new bit of trivia!" first.';
  }
}

getQuote(); 
