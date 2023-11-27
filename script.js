const songName = document.getElementById("song-name");
const singerName = document.getElementById("singer-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const like = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const real = {
    songName: 'For Real This Time',
    artist: 'Eredaze',
    file: 'for_real_this_time',
    liked: false,
};
const trapped = {
    songName: 'Trapped In My Mind',
    artist: 'Adam Oh',
    file: 'trapped_in_my_mind',
    liked: false,
};
const stay = {
    songName: 'Stay True to You',
    artist: 'Eredaze',
    file: 'stay_true_to_you',
    liked: false,
};
const doka = {
    songName: 'Culpado',
    artist: 'Sidoka',
    file: '_culpado',
    liked: false,
};

const playlist = JSON.parse(localStorage.getItem('playlist')) ?? [real, trapped, stay, doka];

let sortedPlaylist = [...playlist];

let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false

function playSong() {
    play.querySelector(".bi").classList.remove("bi-play-fill");
    play.querySelector(".bi").classList.add("bi-pause-fill");
    isPlaying = true;
    song.play();
}

function pauseSong() {
    play.querySelector(".bi").classList.remove("bi-pause-fill");
    play.querySelector(".bi").classList.add("bi-play-fill");
    isPlaying = false;
    song.pause();
}

function playPauseDecider() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        like.querySelector(".bi").classList.remove("bi-heart");
        like.querySelector(".bi").classList.add("bi-heart-fill");
        like.classList.add("bt-active");
    }
    else {
        like.querySelector(".bi").classList.remove("bi-heart-fill");
        like.querySelector(".bi").classList.add("bi-heart");
        like.classList.remove("bt-active");
    }
}

function loadSong() {
    cover.src = `images/${sortedPlaylist[index].file}.jpg`; 
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    singerName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    } else {
        index -= 1;
    }
    loadSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    loadSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
};

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
};

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist)
        shuffleButton.classList.add("bt-active");
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...playlist];
        shuffleButton.classList.remove("bt-active");
    }
}

function repeatButtonClicked() {
    if(repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add("bt-active");
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove("bt-active");
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let minutes = Math.floor((originalNumber - (hours * 3600)) / 60);
    let seconds = Math.floor(originalNumber - (hours * 3600) - (minutes * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}


function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(playlist));
}

loadSong();
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
like.addEventListener('click', likeButtonClicked);