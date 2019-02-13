


(function () {
    /* function for getting test data */
    $.get('http://localhost:3000/', function (data, status) {
        console.log(data);
        const test = { ...data };
        if (data == 0)
            return;//if test was not received here

        /* result will hold the keys of the object now we can acces each object */
        let result = Object.keys((test.question_set));
        console.log(result);
        /* decleraing a variable count so that we can access the question set wise */
        let count = 0;

        result.map((key) => {
            console.log("key : ",key);
            /*-----for top of nav bar type adding sets to a array */
            sets_for_types_of_question.push(`<div class="tag bg-blue-light" id=${key}><p class="margin-0 tag-text fff">${key}</p></div>`);

            const temp_button=[];
            //sideview_question_status.push(`<h5 class="set">${key}</h5>`);
            test.question_set[key].questions.map((question, index) => {
                myQuestions.push({
                    id : index,
                    question: question.question,
                    answers: question.options
                })
                //console.log(count);
    

                marks_of_each_question.push(question.marks);


                temp_button.push(`<button class="classic-btn normal" id="${count++}" value=${index + 1}>${index + 1}</button>`);
                //sideview_question_slide.push(`<button class="classic-btn normal" id="${count++}" value=${index + 1}>${index + 1}</button>`);
                //sideview_question_status.push(`<button class="classic-btn normal" id="${count++}">${index + 1}</button>`);
            })
            const obj = {
                key : key,
                button :temp_button 
            }

            q_type_keys.push(obj);
        });
        /* setting clock to null because exam has not yet started */
        time_clock.innerHTML = "";

        /* storing the total time of exam received from server in a variable */
        total_time_for_exam = test.test_duration;

        /* calling a method toggleClock() that is gonnna receive the total time of exam and handle it and update it ! */
        toggleClock(total_time_for_exam);

        /* setting the top-set slide none */
        question_type.innerHTML=""
        question_type.innerHTML=sets_for_types_of_question.join("");


        /* calling neccesary function to display question on web page and set timer */
        testBilder();
        intitDeclaration();
        showSlide(0);

    })


/* ---------------------------------------VARIABLES DECLERATION---------------------- */

const myQuestions = [];


    let currentSlide = 0
    const button = 'BUTTON'
    const btns = document.getElementById('question-btns');
    const test = document.getElementById('test-container-all');

     /* DECLERATION OF GLOBAL VARIABLES !!!! */
     let slides;
     const marks = document.getElementById('marks');

     /* adding a variable for storing the questions-bar slides */
     const question_type=document.getElementById('question_type');
     const sideview_question_slide=[];
     /* setting the set at top  */
     const sets_for_types_of_question = [];
     /* adding a clear response button */
     let clear = document.getElementById('clear-response-btn');
     let review = document.getElementById('review-btn');
     let next = document.getElementById('next-btn')
     let prev = document.getElementById('prev-btn')
     let submit = document.getElementById('submit-btn')
     let questionNumber = document.getElementById('question-number');
     const sideview_question_status = [];
     let total_time_for_exam = 0;
     /* var to select the timer clock on web page */
     const time_clock = document.getElementById('time-clock');
     /* var to store the last slide number so that we can change the class*/
     let prevSlide = -1;
     /* question types */
     let q_type_keys=[]; 
     const keys=[];
     
     let q_types =[] ;
     let q_type_buttons;

        let key;


     /* marks of each question */
     let marks_of_each_question = [];







/*---------------------------------------EVENT LISTENER----------------------------*/


btns.addEventListener('click', function (e) {
    e.preventDefault()
    if (e.target.tagName === button) {

        if (e.target.attributes.id === undefined)
            btnID = 0
        else
            btnID = parseInt(e.target.attributes.id.value)
        showSlide(btnID);
    }
    // e.target.attributes.id.value
    // e.target.attributes.class.value
   // console.log(e)
})


$('#f-screen').click()
function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}


document.getElementById('f-screen').addEventListener('click', function (e) {
    launchIntoFullscreen(document.documentElement);

})

review.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(currentSlide)
    showNextSlide();
    reviewed(currentSlide - 1);
})
prev.addEventListener('click', function (e) {
    e.preventDefault()
    showPreviousSlide()
})
next.addEventListener('click', function (e) {
    e.preventDefault()
    showNextSlide()
})
clear.addEventListener('click',function(e){
    e.preventDefault();
    clearResponse();
})


function addEvent()
{
    q_type_buttons.map(button=>{
       // console.log(button)
        q_type_buttons[button].addEventListener('click',function(e){
            // console.log(e);
            // console.log("clicked");

            changeButtons(q_type_keys[button].key,button);
        })
    })
}























/* ---------------------------------------Functions--------------------------------- */
function intitDeclaration() {
    slides = document.querySelectorAll(".slide")
    q_types=q_type_keys.map(obj=>{
    console.log("OBJ : ",obj);
      keys.push(obj.key);
      return `#${obj.key}`
  })
  q_type_buttons = $(`${q_types.join(',')}`);
   addEvent();
   changeButtons(q_type_keys[0].key,0);
   key=0;
}


function showSlide(n) {
    
    slides[currentSlide].classList.remove("active-slide")
    slides[n].classList.add("active-slide")
    currentSlide = n;
    console.log("N TH SLIDE : ",n);
    let q_number = parseInt(slides[n].getAttribute('name'))+1;
    questionNumber.innerHTML = q_number;
    let length =getSetLength(key);
    console.log("LENGTH : ",length)
    if (currentSlide === 0) {
        prev.style.display = "none"
    } else {
        prev.style.display = "inline-block"
    }
    review.style.display = "block";
    if (currentSlide === length - 1) {
        next.style.display = "none"
        submit.style.display = "inline-block"
    } else {
        next.style.display = "inline-block"
        submit.style.display = "none"
    }

    
    marks.innerHTML=`<strong>Mark for this question : ${marks_of_each_question[n]}</strong>`



    /* function that will change the class of the button */
    IsAnsweredOrIsSkipped(prevSlide);
    prevSlide = n;

}





/* function to toggle the clock */
function toggleClock(total_duration) {
    let total_time = total_duration;
    setInterval(function () {
        setClock(total_time);
        if(total_time===(total_duration/2))
        {
            /* submit button available at half time */
            submit.style.display = "inline-block";
        }
        total_time = total_time - 1000;//because 1sec = 1000 milliseconds
    }, 1000)

}



/* function to handle the total time of exam and time elapsed */
function setClock(total_duration) {
    /* since total_duration will be in milli sec we need to convert it into sec and min and hrs asap */
    //created a function convertMillisecondsToDigitalClock
    const time = convertMillisecondsToDigitalClock(total_duration);
    const sec = time.seconds;
    const min = time.minutes;
    const hr = time.hours;
    /* if time is over */
    if(sec+min+hr===0)
    {
        //window.location="/exam-over";
        return;
    }
    let clock = "";
    if (hr == 0) {
        clock = min + "m" + " " + sec + "sec";
    }
    else {
        clock = hr + "hr" + " " + min + "m" + " " + sec + "sec";
    }
    time_clock.innerHTML = clock;

}

// CONVERT MILLISECONDS TO DIGITAL CLOCK FORMAT
function convertMillisecondsToDigitalClock(ms) {
    let hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
    let minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
    let seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    };
}


function IsAnsweredOrIsSkipped(n) {
    /* to add the class visited to sidebar button */
    /* <button class="classic-btn normal" id="${count++}">${index + 1}</button> this is the html of button */

    let resource = getButtonAndTags(n);
    const visited_button = resource.button;
    const inputTags = resource.tags;

    visited_button.removeClass();
    if (isAnswered(inputTags)) {
        visited_button.addClass("classic-btn visited");
    }
    else {
        visited_button.addClass("classic-btn not-answered");
    }
}

/* function for review button */
function reviewed(n) {
    let resource = getButtonAndTags(n);
    const reviewed_button = resource.button;
    const inputTags = resource.tags;
    reviewed_button.removeClass();
    if (isAnswered(inputTags)) {
        reviewed_button.addClass("classic-btn answered-to-review");
    }
    else {
        reviewed_button.addClass("classic-btn to-review");
    }
}


/* function that will return us button and input tags of slide */
function getButtonAndTags(n) {
    return {
        button: $(`#${n}`),
        tags: $(`:input[name="question${n}"]`)
    }
}

/* function that will receive the radio buttons group and check is answered or not */
function isAnswered(inputTags) {
    let isAnswered = false;
    inputTags.map((i) => {
        if (inputTags[i].checked) {
           // console.log("checked");
            isAnswered = true;
        }
    })
    return isAnswered;
}



/* function for clearing response */
function clearResponse(){
    //console.log("IN CLEAR RESPONSE FUNCS")
    let inputTags = getButtonAndTags(currentSlide).tags;
    inputTags.map((i) => {
        if (inputTags[i].checked) {
           // console.log("checked");
           inputTags[i].checked=false;
        }
    })

}

function showNextSlide() {
    showSlide(currentSlide + 1)
}

function showPreviousSlide() {
    showSlide(currentSlide - 1)
}

function testBilder() {
    const questionSet = [];

    myQuestions.forEach(function (currentQuestion, questionNumber) {
        var qanswers = []
        //console.log(currentQuestion)
        for (option in currentQuestion.answers) {
            //console.log(currentQuestion.answers[option])
            qanswers.push(`<label>
                 <input type="radio" name="question${questionNumber}" value="${currentQuestion.answers[option]}">
                 
                  ${currentQuestion.answers[option]}
               </label>`)
        }
        questionSet.push(`<div class="slide" name=${currentQuestion.id}>
               <div class="question"> ${currentQuestion.question} </div>
               <div class="answers"> ${qanswers.join("")} 
               </div>
             </div>`);

    })
    btns.innerHTML = "";
    test.innerHTML = questionSet.join("");
}



function changeButtons(button_obj,index)
{
    console.log("btn obj : ",button_obj);
    btns.innerHTML="";
    const temp_key = button_obj;
    q_type_keys.map(obj=>{
        if(obj.key===temp_key)
        {
            btns.innerHTML=`<h5 class="set">${obj.key}</h5>` + obj.button.join("");
        }
    })
    key=index;
    if(key===0)
    showSlide(0);
    else
    showSlide(getLength(key));
    

   
}

function getLength(n)
{
   let length=0;
    for(i=0;i<n;i++)
    {
       length= length+q_type_keys[i].button.length;
    }
    return length;
}

function getSetLength(n)
{
    let length=0;
    for(i=0;i<=n;i++)
    {
       length= length+q_type_keys[i].button.length;
    }
    return length;
}









})()


