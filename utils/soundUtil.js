const map = [];
map['like'] = new Audio(`${process.env.soundServerHost}/sound/like.wav`);
map['fun'] = new Audio(`${process.env.soundServerHost}/sound/fun.wav`);
map['thanks'] = new Audio(`${process.env.soundServerHost}/sound/thanks.wav`);
map['sad'] = new Audio(`${process.env.soundServerHost}/sound/sad.wav`);
map['angry'] = new Audio(`${process.env.soundServerHost}/sound/angry.wav`);
map['up'] = new Audio(`${process.env.soundServerHost}/sound/up.mp3`);
map['down'] = new Audio(`${process.env.soundServerHost}/sound/down.mp3`);

export default {
    play(emotion) {
        if (emotion) {
            map[emotion.toLowerCase()].play();
        }
    },
}