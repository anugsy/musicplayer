console.log("Let's write some javascript");

let currentsong = new Audio();
let songs; 

function formatTime(seconds) {
    // Ensure we have a whole number
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Pad with leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playmusic = (track, pause=false) => {
    currentsong.src = "/songs/" + track;
    if(!pause){
        currentsong.play();
        play.src = "pause.svg";
    }
    
    

    // Set track name
    document.querySelector(".trackname").innerHTML = decodeURI(track);

    // Reset time display
    document.querySelector(".time").innerHTML = "00:00 / 00:00";
};

async function main() {


    songs = await getsongs();
    // console.log(songs);
    playmusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Anurag</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", () => {
      if(currentsong.paused){
        currentsong.play()
        play.src = "pause.svg"
      }
      else{
        currentsong.pause()
        play.src = "play.svg"
      }
    })

    currentsong.addEventListener("timeupdate", () => {
      console.log(currentsong.currentTime, currentsong.duration)
      document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
      document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
      document.querySelector(".left").style.left = "0"
    })
    
    document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-120%"
    })

    document.querySelector("#prev").addEventListener("click", () => {
        // console.log("prev clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // console.log(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
        else{
            playmusic(songs[index])
        }

      
    })
    document.querySelector("#next").addEventListener("click", () => {
        // console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // console.log(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if((index+1)<songs.length){
            playmusic(songs[index+1])
        }
        else{
            playmusic(songs[index])
        }
        
    })
}

main()
