var socket = io();
console.log(socket)
socket.on('audioMessage', function (audioChunks) {
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
});

socket.on('user', function (usercount) {
    $('.usercount').text(usercount)
});


navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        var audioChunks = [];
        $('.play-button').on('mousedown touchstart', function (e) {
            mediaRecorder.start();
            $(this).toggleClass("paused");
        }).bind('mouseup mouseleave touchend', function () {
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                $(this).toggleClass("paused");
            }
        });
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);

        });
        mediaRecorder.addEventListener("stop", () => {
            //socket.broadcast.emit('audioMessage', audioChunks);
            socket.emit('audioMessage', audioChunks);
            audioChunks = [];
        });
    });