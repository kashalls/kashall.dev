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
    const EasterEggChance = Math.floor((Math.random() * 100) + 1);
    console.log(EasterEggChance == 69 ? `${EasterEggChance} is kind of a lucky number around here.` : `${EasterEggChance} is pretty unlucky.`);
    if (EasterEggChance == 69) {
        const Egg = Math.floor((Math.random() * 3) + 1);
        console.log('Egg: ' + Egg);
        if (Egg == 1) {
            videoId = 'Wl959QnD3lM';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'In the';
            document.getElementById('second').innerHTML = 'future';
            document.getElementById('third').innerHTML = 'Humor will';
            document.getElementById('fourth').innerHTML = '<br>be randomly';
            document.getElementById('fifth').innerHTML = 'generated.';

        } else if (Egg == 2) {
            videoId = 'H_QKDidtyow';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'Do';
            document.getElementById('second').innerHTML = 'The';
            document.getElementById('third').innerHTML = 'Dishes';
            document.getElementById('fourth').innerHTML = '<br>- Love';
            document.getElementById('fifth').innerHTML = 'Mom';
        } else if (Egg == 3) {
            videoId = 'IndDk5xtye0';
            if (!secretRan) activateSecret();

            document.getElementById('first').innerHTML = 'Nice';
            document.getElementById('second').innerHTML = 'It\'s';
            document.getElementById('third').innerHTML = 'Sick';
            document.getElementById('fourth').innerHTML = '<br>KK';
            document.getElementById('fifth').innerHTML = 'Mode';
        }
    }
}
