// TOPICS COVERED
// DICTIONARIES
// INDEXING
// FILTERING
// EVENT LISTENERS
// FUNCTIONS
// DOM MANIPULATION
// SET INTERVAL
// ADDING/REMOVING CLASSLIST
// POPUPS -- CHATGPT
// CONDITIONAL STATEMENTS

// CONFUSIONS - 
// LOCAL STORAGE
// ADDING REMOVED ELEMENT

import { data } from "./dataset.js";

let wordLen = 0;
let selectedCategory1 = 'normal';
let clicked = null;
let count = 0;
let correct_letters = 0;
let incorrect_letters = 0;
let index = 0;
let startTime = 0;
let intervalId = null;
let wpmCalc = 0;
let accuracy = 0;
let rawSpeed = 0;

let consistencyScore = 0;

function renderContentHTML(selectedCategory) {
    const words = document.querySelector('.js-words');
    const changebtn = document.querySelector('.change-size');

    words.addEventListener('click', () => {
        quoteSelector.classList.remove('quote-selected');
        words.classList.add('selected-words');
        if (changebtn) changebtn.remove();
        let word = `
            <button class="length l1">10</button>
            <button class="length">25</button>
            <button class="length">50</button>
            <button class="length l4">100</button>
        `;
        
        document.querySelector('.js-third-box').innerHTML = word;

        document.querySelectorAll('.length').forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('word-length');
                wordLen = parseInt(button.innerHTML);
                updateItemCategory(selectedCategory);
            });
        });
    });
    updateItemCategory(selectedCategory);
}


function updateItemCategory(selectedCategory) {
    let itemCategory = data.filter(item => item.category === selectedCategory);

    if (wordLen) {
        itemCategory = itemCategory.filter(item => item.words === wordLen);
    }
    // console.log(itemCategory.length);
    const itemRender = itemCategory[Math.floor(Math.random() * itemCategory.length)]; 
    // console.log(itemRender);
    
    let dataHTML = '';

    const wordCount = itemRender.words;
    // console.log(`total words = ${wordCount}`);
    count = 0;
    
    if (itemRender) {
        itemRender.content.split('').forEach(letter => {
            dataHTML += `<letter class="letter">${letter}</letter>`;
            count++;
        });
    }
    // console.log(`total characters = ${count}`);
    document.querySelector('.full-width').innerHTML = dataHTML;

}

function startTimer(){
    if(!intervalId){
        intervalId = setInterval(() => {
            startTime++;
            // console.log(startTime);
        },1000);
    }
}
document.addEventListener('keydown', (event) => {
    const letters = document.querySelectorAll('.letter');
    const letter = letters[index];

    startTimer();
    if (event.key === ' ') {
        event.preventDefault();
    }    
    // SHIFT HANDLING PURPOSE
    if (event.key.length > 1) return;
    
    if (index < letters.length) {
        if (event.key === letter.textContent) {
            letter.classList.add('correct');
            correct_letters++;
            // console.log(correct_letters);
            
        } else {
            letter.classList.add('incorrect');
            incorrect_letters++;
            // console.log(incorrect_letters);
        }
        index++;
    }
    if(index === letters.length){
        wpmCalc = ((correct_letters*60)/(5*startTime)).toFixed(0);
        accuracy = ((correct_letters/count)*100).toFixed(0);
        rawSpeed = ((count*60)/(5*startTime)).toFixed(0);
        consistencyScore = (100-((Math.abs(wpmCalc-rawSpeed)/rawSpeed)*100)).toFixed(1);
        fPerformanceHTML();
        clearInterval(intervalId);
        intervalId = null;
        startTime = 0;
    }
});

function fPerformanceHTML(){
    const performanceHTML = 
        `
        <div class="grid-container">
                <div class="top-left">
                    <div class="WPM">wpm</div>
                    <div class="count-no">${wpmCalc}</div>
                    <div class="acc">acc</div>
                    <div class="acc-no">${accuracy}%</div>
                </div>
                <div class="top-right"><img src="./image.png" width="1200px" height="250px"></div>
                <div class="bottom-left">
                    <div class="test-type">test type</div>
                    <!--<div class="info-test">Words </div>-->
                    <div class="info-test">english</div>
                    <div class="info-test">${selectedCategory1}</div>
                </div>
                <div class="bottom-right">
                    <div>
                        <div class="raw">raw</div>
                        <div class="raw-count">${rawSpeed}</div>
                    </div>
                    <div>
                        <div class="char">characters</div>
                        <div class="char-count" title="correct/incorrect">${correct_letters}/${incorrect_letters}</div>
                    </div>
                    <div>
                        <div class="consistency">consistency</div>
                        <div class="cons-perc">${consistencyScore}%</div>
                    </div>
                    <div>
                        <div class="time">time</div>
                        <div class="time-in-sec">${startTime}s</div>
                    </div>
                </div>
            </div>
            
            <div class="buttons-set">
                <button><i class="fas fa-fw fa-chevron-right"></i></button>
                <button class="tooltip"><span class="tooltiptext">Restart Test</span><i class="fas fa-fw fa-sync-alt"></i></button>
                <button><i class="fas fa-fw fa-exclamation-triangle"></i></button>
                <button><i class="fas fa-fw fa-align-left"></i></button>
                <button><i class="fas fa-fw fa-backward"></i></button>
                <button><i class="far fa-fw fa-image"></i></button>
            </div>
            <p><u>Sign in</u>-to save your result</p>
        `;
        document.querySelector('.full-width').innerHTML = performanceHTML;
}

renderContentHTML(selectedCategory1);


// EVENT LISTENERS FOR PUNCTUATIONS
let countP = 0;
const selectedCategoryPunc = document.querySelector('.js-punc');
selectedCategoryPunc.addEventListener('click', () => {
    countP++;
    console.log(countP);    
    if(countP%2 === 0){
        selectedCategoryPunc.classList.remove('cl-punc');
        if(clicked === 'punctuation'){
            selectedCategory1 = 'numbers';
            renderContentHTML(selectedCategory1);
        }
        else{
            selectedCategory1 = 'normal';
            renderContentHTML(selectedCategory1);
        }
    }
    else{
        selectedCategory1 = 'punctuation';
        selectedCategoryPunc.classList.add('cl-punc');
        quoteSelector.classList.remove('quote-selected');
        if (clicked === 'numbers') {
            selectedCategory1 = 'combined';
            renderContentHTML(selectedCategory1);
        }
        renderContentHTML(selectedCategory1);
        clicked = 'punctuation';
    }
    startTime = 0;
    clearInterval(intervalId);
    intervalId = null;
    index = 0;
    correct_letters = 0;
    incorrect_letters = 0;
    console.log(clicked);
    
});

// EVENT LISTENER FOR NUMBERS
let countN = 0;
const selectedCategoryNum = document.querySelector('.js-num');
selectedCategoryNum.addEventListener('click', (event) => {
    countN++;
    console.log(countN);    
    if(countN%2 === 0){
        selectedCategoryNum.classList.remove('cl-num');
        if(clicked === 'numbers'){
            selectedCategory1 = 'punctuation';
            renderContentHTML(selectedCategory1);
        }
        else{
            selectedCategory1 = 'normal';
            renderContentHTML(selectedCategory1);
        }
        selectedCategoryPunc.add();
    }
    else{
        selectedCategory1 = 'numbers';
        selectedCategoryNum.classList.add('cl-num');
        quoteSelector.classList.remove('quote-selected');
        startTime = 0;
        if (clicked === 'punctuation') {
            selectedCategory1 = 'combined';
            renderContentHTML(selectedCategory1);
        }
        renderContentHTML(selectedCategory1);
        clicked = 'numbers';
    }
    startTime = 0;
    clearInterval(intervalId);
    intervalId = null;
    index = 0;
    correct_letters = 0;
    incorrect_letters = 0;
    console.log(clicked);
    
});

//EVENT LISTENER FOR QUOTE
let countQ = 0;
const quoteSelector = document.querySelector('.js-quote');
quoteSelector.addEventListener('click', () => {
    // console.log(`quote selected`);
    countQ++;
    if(countQ%2 == 0){
        selectedCategory1 = 'normal';
        renderContentHTML(selectedCategory1);
        quoteSelector.classList.remove('quote-selected');
    }
    else{
        selectedCategory1 = 'quotes';
        quoteSelector.classList.add('quote-selected');
        renderContentHTML('quotes');
        if(selectedCategoryPunc) selectedCategoryPunc.remove();
        if(selectedCategoryNum) selectedCategoryNum.remove();
    }
    startTime = 0;
    clearInterval(intervalId);
    intervalId = null;
    index = 0;
    correct_letters = 0;
    incorrect_letters = 0;
});

// EVENT LISTENER FOR RELOAD,RESTART
const reload = document.querySelectorAll('.js-reload-logo, .js-reload-keyboard, .js-reload-text');
reload.forEach(element => {
    element.addEventListener('click', () => {
        renderContentHTML(selectedCategory1);
        clicked = 'punctuation';
        startTime = 0;
        clearInterval(intervalId);
        intervalId = null;
        index = 0;
        correct_letters = 0;
        incorrect_letters = 0;
    });
});
const restartButton = document.querySelector('.js-restart');
restartButton.addEventListener('click', () => {
    renderContentHTML(selectedCategory1);
    clicked = 'punctuation';
    startTime = 0;
    clearInterval(intervalId);
    intervalId = null;
    index = 0;
    correct_letters = 0;
    incorrect_letters = 0;
});


// Popup functionality
const popup = document.querySelector('.popup');
const openpopup = document.querySelector('.openPopupBtn');
const closepopup = document.querySelector('.closepopup');
openpopup.addEventListener('click', () => {
    popup.style.display = "flex";
});
closepopup.addEventListener('click', () => {
    popup.style.display = "none";
});
window.addEventListener('click', (event) => {
    if (event.target === popup) popup.style.display = "none";
});
