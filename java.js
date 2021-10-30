//let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMoreBtn = musicList.querySelector("#close");

//load different song when refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); // calling load music function once window load
    playingNow();
})

//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    // here we'll increment of index by 1
    musicIndex++;
    //if musicIndex is greater than array lenght then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);  
    playMusic();   
    playingNow();  
}

//prev music function
function prevMusic() {
    // here we'll decrement of index by 1
    musicIndex--;
    //if musicIndex is less than 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);  
    playMusic();    
    playingNow();
}

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music function
nextBtn.addEventListener("click", ()=>{
    nextMusic();  //Calling next music function
});

//prev music function
prevBtn.addEventListener("click", ()=>{
    prevMusic();  //Calling next music function
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; // getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if( totalSec < 10){// adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if( currentSec < 10){// adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let's update playing song current time according to progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;// getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration =  mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    playMusic();
});

// working on shuffle song according to the item
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  // first we get the innertext of the icon when we'll change accordlingly
  let getText = repeatBtn.innerText; //getting innertext of icon
  // let's do different changes on different icon using swtich
  switch (getText) {
    case "repeat": //if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one": //if icon is repeat_one than change to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffle");
      break;
    case "shuffle": // if icon is shuffle then change to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  }
});


/*
just changed the icon, now let's work
on what to do after the song end 
*/

mainAudio.addEventListener("ended", () => {
    // we'll do according to the icon means if user has set icon to loop
    //song then we'll repeat the current song and will do further accordingly
  
    let getText = repeatBtn.innerText; //getting innertext of icon
    // let's do different changes on different icon using swtich
    switch (getText) {
      case "repeat": //if this icon is repeat then simply we call the nextMusic function so the next song will play
        nextMusic();
        break;
      case "repeat_one": //if icon is repeat_one than we'll change the current playing song to 0 so song will play from beginning
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic(); //calling playMusic function
        break;
      case "shuffle": // if icon is shuffle then change to repeat
        //generating random index between the max range of array length
        let randIndex = Math.floor(Math.random() * allMusic.length + 1);
        do {
          randIndex = Math.floor(Math.random() * allMusic.length + 1);
        } while (musicIndex == randIndex); //this loop run untill
        musicIndex = randIndex; // passing randomindex to musicIndec
        loadMusic(musicIndex); //calling loadMusic function
        playMusic(); //calling playMusic function
        playingNow();
        break;
    }
  });
  
  showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
  });
  
  hideMoreBtn.addEventListener("click", () => {
    showMoreBtn.click();
  }); 


  //getting li according to array lenght
 const ulTag = wrapper.querySelector("ul");

 //let's create li according to the array length to li
 for(let i = 0; i < allMusic.length; i++){
   //let's pass the song name, artist from the array to li
   let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                      <span>${allMusic[i].name}</span>
                      <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
               </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAduioDuaration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
      let audioDuration = liAudioTag.duration;
      let totalMin = Math.floor(audioDuration / 60);
      let totalSec = Math.floor(audioDuration % 60);
      if( totalSec < 10){// adding 0 if sec is less than 10
          totalSec = `0${totalSec}`;
      }
      liAduioDuaration.innerText = `${totalMin}:${totalSec}`;
      //adding t-duration attribute which we'll use below
      liAduioDuaration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
 }


 //let's work on play particular song on click
 const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
      let audioTag = allLiTags[j].querySelector(".audio-duration")
// let's remove playing from all other li except the one playing
if(allLiTags[j].classList.contains("playing")){
  allLiTags[j].classList.remove("playing");
// let's get that audion duration value and pass to .audio-duration innertext
  let adDuration = audioTag.getAttribute("t-duration");
  audioTag.innerText = adDuration;//passing t-duration to audio duration innertext
}
//if there is an li tag which li-index is equal to musicindex
//then this music is playing now and we'll style it
      if(allLiTags[j].getAttribute("li-index") == musicIndex){
        allLiTags[j].classList.add("playing");
        audioTag.innerText = "playing";
      }
       //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
     }
    
  }

 //let's play song on click
 function clicked(element) {
   //getting particular clicked li tag
   let getLiIndex = element.getAttribute("li-index");
   musicIndex = getLiIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
 }