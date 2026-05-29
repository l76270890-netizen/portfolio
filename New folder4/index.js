const decreaseBtn = document.getElementById("decreaseBtn")
const resetBtn = document.getElementById("resetBtn")
const increaseBtn = document.getElementById("increaseBtn")
const countlabel = document.getElementById("countlabel")
let count = 0

increaseBtn.onclick = function(){
    count++
    countlabel.textContent = count
} 

decreaseBtn.onclick = function(){
    count--
    countlabel.textContent = count
}

resetBtn.onclick = function(){
    count = 0
    countlabel.textContent = count
}




const toFahrenheit = document.getElementById("toFahrenheit")
const textbox = document.getElementById("textbox")
const toCelsius = document.getElementById("toCelsius")
const result = document.getElementById("result")
let temp;



function convert() {
    if(toFahrenheit.checked){
        temp = Number(textbox.value)
        temp = temp * 9 / 5 + 32;
        result.textContent = temp.toFixed(1) + "@F"
    }

    else if(toCelsius.checked){
         temp = Number(textbox.value)
         temp = (temp - 32) * (5/9);
         result.textContent = temp.toFixed(1) + "@C"
    }

    else{
       result.textContent = "Collect all units"
    }
}





function updateClock(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, 0);
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById("clock").textContent = timeString
}

updateClock();









/*calculator*/
const display = document.getElementById("display")


function appendToDisplay (button){
    display.value += button;
}

function clearDisplay(){
    display.value = null
}


function deleteDisplay(){
    display.value = display.value.slice(0,-1)
}


function calculate(){
   try{
     display.value = eval(display.value)
   }

   catch(error){
    display.value = ("error")
   }
}








const slides = document.querySelectorAll(".slides img");
let slideIndex = 0;
let intervalId = null;



initializeSlider()
document.addEventListener("DOMContentLoaded", initializeSlider);


function initializeSlider(){
    if(slides.length > 0){
 slides[slideIndex].classList.add("displaySlide");
 intervalId = setInterval(nextSlide, 5000);
    }
   
}


function showSlide(index){

    if(index >= slides.length){
slideIndex = 0;
    }

    else if(index < 0){
        slideIndex = slides.length -1;
    }



    slides.forEach(slide =>{
        slide.classList.remove("displaySlide")

    });
    slides[slideIndex].classList.add("displaySlide");
}

function prevSlide(){
    clearInterval(intervalId)
slideIndex--;
showSlide(slideIndex)
}

function nextSlide(){
slideIndex++
showSlide(slideIndex)
}


button.forEach((item) =>{
item.onclick = () =>{
    if(item.id == 'clear'){
        display.innerHTML = null
    }else if(item.id == 'equal'){
        display.innerHTML = eval(display.innerHTML)
    }
}
})




const display = document.querySelectorAll('display')
const button = document.querySelectorAll('button')



















