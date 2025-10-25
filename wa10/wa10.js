const newQuoteButton = document.querySelector('#js-new-quote');
const tweetButton = document.querySelector('#js-tweet');
const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

const endpoint = 'https://api.adviceslip.com/advice';
let currentAdvice = '';

newQuoteButton.addEventListener('click', getAdvice);
tweetButton.addEventListener('click', tweetAdvice);

async function getAdvice() {
  console.log('Fetching new advice...');

  try {
    const response = await fetch(endpoint, { cache: 'no-cache' });
    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    console.log(data);

    const advice = data.slip.advice;
    displayAdvice(advice);
    currentAdvice = advice;
  } catch (err) {
    console.error('Fetch error:', err);
    quoteText.textContent = 'Oops! Could not fetch advice.';
  }
}

function displayAdvice(advice) {
  quoteText.textContent = `"${advice}"`;
  answerText.textContent = `— Advice #${Math.floor(Math.random() * 9999)}`;
}

function tweetAdvice() {
  if (currentAdvice) {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentAdvice)}%20%23RandomAdvice`;
    window.open(tweetUrl);
  } else {
    alert('Get some advice first!');
  }
}
getAdvice();
