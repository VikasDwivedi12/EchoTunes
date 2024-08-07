//REMAINING OBJECTIVES
// Make the button controls functional.

let songName = [];
let songPath = [];
let singerName = [];
let coverPath = [];
let duration = [];

const songList = document.querySelector('.songList');
const songInfo = document.querySelector('.songInfo');
const progressBar = document.getElementById("progressBar");
const duration1 = document.getElementById('completed-duration');
const duration2 = document.getElementById('remaining-duration');

//Music player control buttons
const playBtn = document.getElementById('playBtn');
const stepBackward = document.getElementById('stepBackward');
const stepForward = document.getElementById('stepForward');

//Declarations for the current playing song.
let currentSongName;
let currentSongPath;
let currentSingerName;
let currentCoverPath;
let currentDuration;

const apiUrl = './songs_data.json';
let playingStatus = 0;
let audioElement;
progressBar.value = 0;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = (seconds % 60).toFixed();
    return `${padZero(minutes)}:${padZero(secondsRemaining)}`;
}
  
function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}

function cleanPreviousGifs(){
    //This function cleans all the previous gifs.
    const fullChildNode = songList.childNodes;
    for(let i = 3; i < fullChildNode.length; i++){
        otherSongElement = fullChildNode[i].childNodes[3];
        otherSongElement.querySelector('.playing-gif').style.opacity = 0;
    }
}

function gifUpdate(){
     //Function to add gificon to the changed song.
     const currentPlayingIndex = songName.indexOf(currentSongName);
     const allSongElements = document.querySelectorAll('.songElement');
     const currentSongElement = allSongElements[currentPlayingIndex];
     currentSongElement.querySelector('.playing-gif').style.opacity = 1;
}

function changeSong(song_Name, coverPath, duration, songPath, singerName){
    //This function will change the current playing song.
    //Uses of this function are in backward and forward.
    if(playingStatus != 0){
        audioElement.pause();
    }
    
    audioElement = new Audio(songPath);
    audioElement.play();
    playingStatus = 1;
    playBtn.classList.remove('fa-play-circle');
    playBtn.classList.add('fa-pause-circle');

    //Updating the song Info
    songInfo.getElementsByTagName('img')[0].src = coverPath;
    songInfo.getElementsByTagName('h2')[0].innerHTML = song_Name;
    songInfo.getElementsByTagName('p')[0].innerHTML = singerName;

    //Updating the progress bar.
    audioElement.addEventListener('timeupdate', function(){
        let progress = parseInt((audioElement.currentTime/audioElement.duration) * 100);
        progressBar.value = progress;

        duration1.innerHTML = formatTime(audioElement.currentTime);
        duration2.innerHTML = duration;
    })

    cleanPreviousGifs();
    gifUpdate();
}

function generateElements(sName, Cpath, dur, Spath, sgName){
    //Function to create and place the elements in the HTML document, as per the words passed.
    const newElement = document.createElement('div');
    newElement.classList.add('songElement');
    newElement.innerHTML = `
    <img src="${Cpath}">
    <div class="songTitle">
        <h3>${sName}</h3>
        <span>${dur}</span>
        <img src="../data/Images/playing.gif" class="playing-gif">
    </div>
    `;
    
    songList.appendChild(newElement);
    const gifIcon = newElement.querySelector('.playing-gif');
    gifIcon.style.opacity = 0;
    
    newElement.addEventListener('click', function(){
        playBtn.classList.remove("fa-play-circle");
        playBtn.classList.add("fa-pause-circle");

        //Updating the details for the current playing songs.
        currentSongName = sName;
        currentSongPath = Spath;
        currentSingerName = sgName;
        currentCoverPath = Cpath;
        currentDuration = dur;

        if(playingStatus === 0){
            audioElement = new Audio(Spath);
            audioElement.play();
        }
        else{
            audioElement.pause();
            cleanPreviousGifs();
            audioElement = new Audio(Spath);
            audioElement.play();
        }

        playingStatus = 1;
        
        //Changing the design related things.
        gifIcon.style.opacity = 1;
        songInfo.getElementsByTagName('img')[0].src = Cpath;
        songInfo.getElementsByTagName('h2')[0].innerText = sName;
        songInfo.getElementsByTagName('p')[0].innerHTML = sgName;

        //Working with the progress bar;
        audioElement.addEventListener('timeupdate', function(){
            let progress = parseFloat((audioElement.currentTime/audioElement.duration)*100);
            progressBar.value = progress;
            duration1.innerHTML = formatTime(audioElement.currentTime);
            duration2.innerHTML = dur;
        })

        //Code when User slides the progress bar.
        progressBar.addEventListener('change', function(){
            let currentTime = (progressBar.value * audioElement.duration)/100;
            audioElement.currentTime = currentTime;
        })
    })
}

//Event listener for the play-pause button
playBtn.addEventListener('click', function(){
    if(playingStatus === 0){
        audioElement.play();
        playingStatus = 1;
        playBtn.classList.remove('fa-play-circle');
        playBtn.classList.add('fa-pause-circle');
        gifUpdate();
    }
    else{
        audioElement.pause();
        playingStatus = 0;
        playBtn.classList.remove('fa-pause-circle');
        playBtn.classList.add('fa-play-circle');
        cleanPreviousGifs();
    }
})

//Adding the event listener for the next button.
stepForward.addEventListener('click', function(){
    const indexValue = songName.indexOf(currentSongName);

    if(indexValue != (songName.length - 1)){
        currentSongName = songName[songName.indexOf(currentSongName) + 1];
        currentSongPath = songPath[songPath.indexOf(currentSongPath) + 1];
        currentSingerName = singerName[singerName.indexOf(currentSingerName) + 1];
        currentCoverPath = coverPath[coverPath.indexOf(currentCoverPath) + 1];
        currentDuration = duration[duration.indexOf(currentDuration) + 1];
    }
    else{
        currentSongName = songName[0];
        currentSongPath = songPath[0];
        currentSingerName = singerName[0];
        currentCoverPath = coverPath[0];
        currentDuration = duration[0];
    }

    changeSong(currentSongName, currentCoverPath, currentDuration, currentSongPath, currentSingerName);
});

//Adding the event listener for the previous button.
stepBackward.addEventListener('click', function(){
    const indexValue = songName.indexOf(currentSongName);
    const lastIndex = songName.length - 1;

    if(indexValue != 0){
        currentSongName = songName[songName.indexOf(currentSongName) - 1];
        currentSongPath = songPath[songPath.indexOf(currentSongPath) - 1];
        currentSingerName = singerName[singerName.indexOf(currentSingerName) - 1];
        currentCoverPath = coverPath[coverPath.indexOf(currentCoverPath) - 1];
        currentDuration = duration[duration.indexOf(currentDuration) - 1];
    }
    else{
        currentSongName = songName[lastIndex];
        currentSongPath = songPath[lastIndex];
        currentSingerName = singerName[lastIndex];
        currentCoverPath = coverPath[lastIndex];
        currentDuration = duration[lastIndex];
    }

    changeSong(currentSongName, currentCoverPath, currentDuration, currentSongPath, currentSingerName);
});

fetch(apiUrl)
.then((response)=>{
    const data = response.json();
    return data;
})
.then((data)=>{
    for(let i = 0; i < data.length; i++){
        songName[i] = data[i]['songName'];
        songPath[i] = data[i]['songPath'];
        singerName[i] = data[i]['singerName'];
        coverPath[i] = data[i]['coverPath'];
        duration[i] = data[i]['duration'];
    }
    for(let i = 0; i < songName.length; i++){
        generateElements(songName[i], coverPath[i], duration[i], songPath[i], singerName[i]);
    }
})
.catch((error)=>{
    console.log(error);
    document.getElementsByTagName('html')[0].innerHTML = "Oops, SomeThing's wrong at our end.";
})