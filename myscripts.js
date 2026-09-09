braceletImage.src = "images/bracelet.png";



    /* ==========================================
       VARIABLES
    ========================================== */

    const modal = document.getElementById("arModal");

    const video = document.getElementById("cameraVideo");

    const canvas = document.getElementById("arCanvas");

    const ctx = canvas.getContext("2d");

    const instruction =
        document.getElementById("instruction");

    const cameraMessage =
        document.getElementById("cameraMessage");


    /* ==========================================
       BRACELET IMAGE
    ========================================== */

    const braceletImage = new Image();

    braceletImage.src = "img22.png";


    /* ==========================================
       MEDIA PIPE HAND TRACKING
    ========================================== */

    const hands = new Hands({
        locateFile: (file) => {

            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

        }
    });


    hands.setOptions({

        maxNumHands: 1,

        modelComplexity: 1,

        minDetectionConfidence: 0.6,

        minTrackingConfidence: 0.6

    });


    /* ==========================================
       HAND DETECTED
    ========================================== */

    hands.onResults(onHandResults);


    /* ==========================================
       OPEN AR
    ========================================== */

    async function openAR() {

        modal.classList.add("active");

        cameraMessage.style.display = "block";

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: "user",

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        }

                    },

                    audio: false

                });


            video.srcObject = stream;

            await video.play();

            cameraMessage.style.display = "none";

            startCameraTracking();

        }

        catch(error) {

            console.error(error);

            cameraMessage.innerHTML = `

                <h2>Camera Access Required</h2>

                <p>
                    Please allow camera permission
                    and try again.
                </p>

            `;

        }

    }



    /* ==========================================
       START HAND TRACKING
    ========================================== */

    let camera;

    function startCameraTracking() {

        camera = new Camera(video, {

            onFrame: async () => {

                await hands.send({
                    image: video
                });

            },

            width: 1280,

            height: 720

        });

        camera.start();

    }



    /* ==========================================
       HAND RESULTS
    ========================================== */

    function onHandResults(results) {

        if (!video.videoWidth) {
            return;
        }


        /* Canvas size */

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;


        /* Clear */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* No hand */

        if (
            !results.multiHandLandmarks ||
            results.multiHandLandmarks.length === 0
        ) {

            instruction.innerText =
                "Show your hand to the camera";

            return;

        }


        instruction.innerText =
            "Bracelet placed on your wrist ✨";


        const landmarks =
            results.multiHandLandmarks[0];


        /* ======================================
           IMPORTANT LANDMARKS
        ====================================== */

        const wrist = landmarks[0];

        const indexMCP = landmarks[5];

        const middleMCP = landmarks[9];

        const pinkyMCP = landmarks[17];


        /* ======================================
           MIRROR X
        ====================================== */

        function point(landmark) {

            return {

                x: (1 - landmark.x) *
                   canvas.width,

                y: landmark.y *
                   canvas.height

            };

        }


        const wristPoint =
            point(wrist);

        const indexPoint =
            point(indexMCP);

        const middlePoint =
            point(middleMCP);

        const pinkyPoint =
            point(pinkyMCP);


        /* ======================================
           PALM CENTER
        ====================================== */

        const palmCenter = {

            x:
                (
                    indexPoint.x +
                    middlePoint.x +
                    pinkyPoint.x
                ) / 3,

            y:
                (
                    indexPoint.y +
                    middlePoint.y +
                    pinkyPoint.y
                ) / 3

        };


        /* ======================================
           WRIST → PALM VECTOR
        ====================================== */

        const dx =
            palmCenter.x -
            wristPoint.x;

        const dy =
            palmCenter.y -
            wristPoint.y;


        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const normalX =
            dx / length;

        const normalY =
            dy / length;


        /* ======================================
           MOVE BRACELET SLIGHTLY BELOW WRIST
        ====================================== */

        const braceletCenter = {

            x:
                wristPoint.x -
                normalX * 25,

            y:
                wristPoint.y -
                normalY * 25

        };


        /* ======================================
           WRIST WIDTH
        ====================================== */

        const wristWidth =

            Math.sqrt(

                Math.pow(
                    indexPoint.x -
                    pinkyPoint.x,
                    2
                )

                +

                Math.pow(
                    indexPoint.y -
                    pinkyPoint.y,
                    2
                )

            );


        /* ======================================
           BRACELET SIZE
        ====================================== */

        const braceletWidth =
            wristWidth * 2.0;


        const aspectRatio =
            braceletImage.height /
            braceletImage.width;


        const braceletHeight =
            braceletWidth *
            aspectRatio;


        /* ======================================
           BRACELET ROTATION
        ====================================== */

        let angle =
            Math.atan2(
                dy,
                dx
            ) + Math.PI / 2;


        /* ======================================
           DRAW BRACELET
        ====================================== */

        ctx.save();


        ctx.translate(
            braceletCenter.x,
            braceletCenter.y
        );


        ctx.rotate(angle);


        ctx.globalAlpha = 0.96;


        ctx.drawImage(

            braceletImage,

            -braceletWidth / 2,

            -braceletHeight / 2,

            braceletWidth,

            braceletHeight

        );


        ctx.restore();

    }



    /* ==========================================
       CLOSE AR
    ========================================== */

    function closeAR() {

        modal.classList.remove("active");


        /* Stop camera */

        if (video.srcObject) {

            video.srcObject
                .getTracks()
                .forEach(track => {

                    track.stop();

                });

            video.srcObject = null;

        }


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

