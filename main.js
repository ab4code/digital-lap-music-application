const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist");
mainAudio = wrapper.querySelector("#main-audio");
playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressBar = wrapper.querySelector(".progress-bar"),
  progressArea = wrapper.querySelector(".progress-area"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMoreBtn = wrapper.querySelector("#close");

let musicIndex = Math.floor((Math.random));

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load mucis once window load
  playingNow();
});

// load music function
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

//next music function
function nextMusic() {
  //increasing index by 1
  musicIndex++;
  // if musicIndex is > array length then musicIndex will be 1 so the first song will play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic() {
  //decreasing index by 1
  musicIndex--;
  // if musicIndex is < 1 then musicIndex will be array lngth so the last song will play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//play or pause music event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // if isMusicPlay is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});

prevBtn.addEventListener("click", () => {
  prevMusic(); //calling next music function
});

// update progress bar according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting current time of song
  const duration = e.target.duration; // getting total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuaration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      // adding - if sec is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuaration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    // adding - if sec is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//updating playing song current time to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of progress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
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

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the the array to li
  let liTag = ` <li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuaration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      // adding - if sec is less than 10
      totalSec = `0${totalSec}`;
    }

    liAudioDuaration.innerText = `${totalMin}:${totalSec}`;
    
  });
}








