var questions = [
    {
        title: "Commonly used data types DO NOT include:",
        multiChoice: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
        answer: "3. alerts"
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        multiChoice: ["1. quotes", "2. curly brackets", "3. parentheses", "4. square brackets"],
        answer: "3. parentheses"
    },
    {
        title: "Arrays in Javascript can be used to store ____.",
        multiChoice: ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of the above"],
        answer: "4. all of the above"
    },
    {
        title: "String values must be enclosed within ____ when being assigned to variables.",
        multiChoice: ["1. commas", "2. curly brackets", "3. quotes", "4. parenthesis"],
        answer: "3. quotes"
    },
    {
        title: "A very useful tool for used during development and debugging for printing content to the debugger is:",
        multiChoice: ["1. Javascript", "2. terminal / bash", "3. for loops", "4. console log"],
        answer: "4. console log"
    }]
    
// a variable for start time
let secondsLeft = 76;

//the element that displays the time
let timer = document.getElementById("timer");

//div for high scores
let scores = document.getElementById("scores");

let buttonsDiv = document.getElementById("buttons")

//button for high scores
let viewScoresBtn = document.getElementById("view-scores")

//start button div
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);


// variable for the questions title
var questionTitle = document.getElementById("question-title");

var instructions = document.getElementById("instructions");

// div to hold the results
let results = document.getElementById("results");

// div for the choices
var choices = document.getElementById("choices");


// an array to store high scores
let emptyArray = [];

// the array of high scores from local storage
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));

// keeping track of which question we're on
var questionCount = 0;

//keeping score
let score = 0

//Timer starts when the user clicks startButton (see above).
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

//function to load the questions on the page
function displayQuestions() {
  removeEls(startButton, instructions);

  if (questionCount < questions.length) {
    questionTitle.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation();

        if (el.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 10;
          secondsLeft = secondsLeft - 15;
        }
        
        questionTitle.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
  }
}


function captureUserScore() {
    timer.remove();
    choices.textContent = "";

    let initialsInput = document.createElement("input");
    let scoreButton = document.createElement("input");

    resultsHeader.innerHTML = "All Done!"
    results.innerHTML = `Your final score is ${score}.`;
    enterInitials.innerHTML = "Enter initials: "

    initialsInput.setAttribute("type", "text");
    scoreButton.setAttribute("type", "button");
    scoreButton.setAttribute("value", "Post My Score!");
    scoreButton.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
 
  enterInitials.append(initialsInput);
  enterInitials.append(scoreButton);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (let el of els) el.remove();
}

function displayAllScores() {
  removeEls(timer, startButton, results, questionTitle, resultsHeader, enterInitials);
  let scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresHeader.innerHTML = "High Scores"

  scoresArray.forEach(obj => {
    let initials = obj.initials;
    let storedScore = obj.score;
    let resultsP = document.createElement("p");
    resultsP.innerText = `${initials}: ${storedScore}`;
    scores.append(resultsP);
  });
}

function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton, instructions);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
    goBackBtn();
  });
}

function clearScoresBtn() {    
  let clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scores);
    window.localStorage.removeItem("highScores");
  })
  scores.append(clearBtn)
}

function goBackBtn() {
  let backBtn = document.createElement("input");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("value", "Go Back");
  backBtn.addEventListener("click", function(event){
    event.preventDefault();
    window.location.reload();
  })
  buttonsDiv.append(backBtn)
}


viewScores();