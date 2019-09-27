function switchVisible() {
    if (document.getElementById('box')) {
        if (document.getElementById('box').style.display == 'none') {
            document.getElementById('box').style.display = 'block';
            document.getElementById('directory').style.display = 'none';
        }
        else {
            document.getElementById('box').style.display = 'none';
            document.getElementById('directory').style.display = 'block';
        }
    }
}

const allowedKeys = { 78: 'n', 65: 'a', 73: 'i' };
const secretCode = ['n', 'a', 'n', 'i'];
var videoId = 'lQzu4721Cvw';
var codePosition = 0;
var secretRan = false;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

document.addEventListener('keydown', function (e) {
    if (secretRan) return;
    if (allowedKeys[e.keyCode] == secretCode[codePosition]) {
        codePosition++;
        if (codePosition === secretCode.length) {
            activateSecret();
            codePosition = 0;
            secretRan = true;
        }
    }
    else {
        codePosition = 0;
    }
})

function onPlayerReady(event) {
    event.target.setVolume(25);
    event.target.playVideo();
}

function activateSecret() {
    console.log('Loading Secret...');

    player = new YT.Player('iframe', {
        videoId,
        playerVars: {
            controls: 0,
            autoplay: 1,
            loop: 1,
            disablekb: 1,
            enablejsapi: 1,
            iv_load_policy: 3,
            listType: 'search',
            list: videoId
        },
        events: {
            'onReady': onPlayerReady
        }

    })

}

function onLoad() {
    console.log('OwO What\'s This?');
    const EasterEggChance = Math.floor((Math.random() * 100) + 1);
    console.log('Chance: ' + EasterEggChance);
    const Egg = Math.floor((Math.random() * 4) + 1);
    if (EasterEggChance == 69) {
        console.log('Egg: ' + Egg);
        if (Egg == 1) {
            document.getElementById('first').innerHTML = 'Never';
            document.getElementById('second').innerHTML = 'Gonna';
            document.getElementById('third').innerHTML = 'Give';
            document.getElementById('fourth').innerHTML = '<br>You';
            document.getElementById('fifth').innerHTML = 'Up';

            setTimeout(function(){
                window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }, 30000);
        } else if (Egg == 2) {
            videoId = 'H_QKDidtyow';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'Do';
            document.getElementById('second').innerHTML = 'The';
            document.getElementById('third').innerHTML = 'Dishes';
            document.getElementById('fourth').innerHTML = '<br>- Love';
            document.getElementById('fifth').innerHTML = 'Mom';
        } else if (Egg == 3) {
            videoId = 'wSReSGe200A';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'Rub';
            document.getElementById('second').innerHTML = 'Some';
            document.getElementById('third').innerHTML = 'Bacon';
            document.getElementById('fourth').innerHTML = '<br>On';
            document.getElementById('fifth').innerHTML = 'It';
        } else if (Egg == 4) {
            videoId = 'hbPqaPz2Nlc';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'Nice';
            document.getElementById('second').innerHTML = 'It\'s';
            document.getElementById('third').innerHTML = 'Sick';
            document.getElementById('fourth').innerHTML = '<br>KK';
            document.getElementById('fifth').innerHTML = 'Mode';
        }
    }
}