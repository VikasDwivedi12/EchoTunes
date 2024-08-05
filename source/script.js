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

function generateElements(sName, Cpath, duration, Spath, sgName){
    //Function to create and place the elements in the HTML document, as per the words passed.
    const newElement = document.createElement('div');
    newElement.classList.add('songElement');
    newElement.innerHTML = `
    <img src="${Cpath}">
    <div class="songTitle">
        <h3>${sName}</h3>
        <span>${duration}</span>
        <img src="../data/Images/playing.gif" class="playing-gif">
    </div>
    `;

    songList.appendChild(newElement);
    const gifIcon = newElement.querySelector('.playing-gif');
    gifIcon.style.opacity = 0;

    newElement.addEventListener('click', function(){
        if(playingStatus === 0){
            audioElement = new Audio(Spath);
            audioElement.play();
        }
        else{
            audioElement.pause();
            //Now we need to clean the previous already running gifIcon.
            const fullChildNode = songList.childNodes;
            for(let i = 3; i < fullChildNode.length; i++){
                const otherSongElement = fullChildNode[i].childNodes[3];
                otherSongElement.querySelector('.playing-gif').style.opacity = 0;
            }
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
            duration2.innerHTML = duration;
        })

        //Code when User slides the progress bar.
        progressBar.addEventListener('change', function(){
            let currentTime = (progressBar.value * audioElement.duration)/100;
            audioElement.currentTime = currentTime;
        })
    })
}

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
