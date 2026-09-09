/* =====================================================
   PRODUCTS
===================================================== */

const products = [

    {
        id: 1,
        name: "Royal Gold Bracelet",
        category: "Bracelets",
        price: 2499,
        old: 3299,
        image: "Img9.png"
    },

    {
        id: 2,
        name: "Pearl Drop Necklace",
        category: "Necklaces",
        price: 3499,
        old: 4299,
        image: "Img11.png"
    },

    {
        id: 3,
        name: "Elegant Pearl Earrings",
        category: "Earrings",
        price: 1899,
        old: 2499,
        image: "Img12.png"
    },

    {
        id: 4,
        name: "Traditional Gold Jhumka",
        category: "Jhumka",
        price: 2199,
        old: 2899,
        image: "Img13.png"
    },

    {
        id: 5,
        name: "Classic Anklet",
        category: "Anklets",
        price: 1299,
        old: 1699,
        image: "Img14.png"
    },

    {
        id: 6,
        name: "Royal Long Necklace",
        category: "Long Necklaces",
        price: 4299,
        old: 5299,
        image: "Img15.png"
    },

    {
        id: 7,
        name: "Diamond Style Bracelet",
        category: "Bracelets",
        price: 2799,
        old: 3599,
        image: "Img17.png"
    },

    {
        id: 8,
        name: "Golden Style Necklace",
        category: "Necklaces",
        price: 3899,
        old: 4599,
        image: "Img16.png"
    }

];


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   AR VARIABLES
===================================================== */

let cameraStream = null;

let selectedProduct = null;

let animationFrame = null;


/* =====================================================
   GET AR ELEMENTS
===================================================== */

const arModal =
    document.getElementById("arModal");

const cameraVideo =
    document.getElementById("cameraVideo");

const arCanvas =
    document.getElementById("arCanvas");

const ctx =
    arCanvas.getContext("2d");

const jewelleryOverlay =
    document.getElementById(
        "jewelleryOverlay"
    );

const instruction =
    document.getElementById(
        "instruction"
    );

const cameraMessage =
    document.getElementById(
        "cameraMessage"
    );

const closeARBtn =
    document.getElementById(
        "closeARBtn"
    );


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(list) {

    const grid =
        document.getElementById(
            "productGrid"
        );

    grid.innerHTML = "";


    list.forEach(product => {

        grid.innerHTML += `

            <div class="product-card">

                <div class="product-img">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <div class="rating">
                        ★★★★★
                    </div>


                    <div class="price">

                        ₹${product.price.toLocaleString()}

                        <span class="old-price">
                            ₹${product.old.toLocaleString()}
                        </span>

                    </div>


                    <div class="product-actions">

                        <button
                            class="try-btn"
                            onclick="openAR(${product.id})">

                            ✨ TRY IT

                        </button>


                        <button
                            class="add-cart"
                            onclick="addToCart(${product.id})">

                            ADD TO CART

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* =====================================================
   OPEN AR
===================================================== */

async function openAR(productId) {

    console.log(
        "TRY IT clicked:",
        productId
    );


    /* Find product */

    selectedProduct =
        products.find(
            product =>
                product.id === productId
        );


    if (!selectedProduct) {

        console.error(
            "Product not found:",
            productId
        );

        return;
    }


    console.log(
        "Selected product:",
        selectedProduct
    );


    /* Open modal */

    arModal.classList.add(
        "active"
    );


    /* Reset message */

    cameraMessage.classList.remove(
        "hidden"
    );


    cameraMessage.innerHTML = `

        <div class="loader"></div>

        <h2>
            Opening Camera...
        </h2>

        <p>
            Please allow camera permission
        </p>

    `;


    instruction.innerText =
        "Starting camera...";


    /* Set jewellery image */

    jewelleryOverlay.src =
        selectedProduct.image;


    /* Reset overlay */

    jewelleryOverlay.style.display =
        "none";


    try {

        /* Check browser support */

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            throw new Error(
                "Camera API is not supported by this browser."
            );

        }


        /* Stop previous camera */

        stopCamera();


        /* Request camera */

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

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


        /* Connect camera */

        cameraVideo.srcObject =
            cameraStream;


        await cameraVideo.play();


        /* Hide loading */

        cameraMessage.classList.add(
            "hidden"
        );


        instruction.innerText =
            `${selectedProduct.name} — Try it now ✨`;


        /* Show jewellery */

        jewelleryOverlay.style.display =
            "block";


        /* Position jewellery */

        positionJewellery();


        /* Start animation */

        startAR();


    }

    catch(error) {

        console.error(
            "Camera error:",
            error
        );


        cameraMessage.classList.remove(
            "hidden"
        );


        cameraMessage.innerHTML = `

            <h2>
                Camera Access Required
            </h2>

            <p>
                Please allow camera permission
                and click TRY IT again.
            </p>

            <p style="
                margin-top:15px;
                font-size:12px;
                opacity:.7;
            ">
                ${error.message}
            </p>

        `;

    }

}


/* =====================================================
   POSITION JEWELLERY
===================================================== */

function positionJewellery() {

    if (!selectedProduct) {

        return;
    }


    const category =
        selectedProduct.category;


    /* =================================================
       BRACELET
    ================================================= */

    if (
        category === "Bracelets"
    ) {

        jewelleryOverlay.style.width =
            "260px";

        jewelleryOverlay.style.height =
            "180px";

        jewelleryOverlay.style.left =
            "50%";

        jewelleryOverlay.style.top =
            "58%";

        jewelleryOverlay.style.transform =
            "translate(-50%, -50%)";

    }


    /* =================================================
       NECKLACE
    ================================================= */

    else if (
        category === "Necklaces" ||
        category === "Long Necklaces"
    ) {

        jewelleryOverlay.style.width =
            "300px";

        jewelleryOverlay.style.height =
            "350px";

        jewelleryOverlay.style.left =
            "50%";

        jewelleryOverlay.style.top =
            "55%";

        jewelleryOverlay.style.transform =
            "translate(-50%, -50%)";

    }


    /* =================================================
       EARRINGS / JHUMKA
    ================================================= */

    else if (
        category === "Earrings" ||
        category === "Jhumka"
    ) {

        jewelleryOverlay.style.width =
            "230px";

        jewelleryOverlay.style.height =
            "230px";

        jewelleryOverlay.style.left =
            "50%";

        jewelleryOverlay.style.top =
            "43%";

        jewelleryOverlay.style.transform =
            "translate(-50%, -50%)";

    }


    /* =================================================
       ANKLET
    ================================================= */

    else if (
        category === "Anklets"
    ) {

        jewelleryOverlay.style.width =
            "280px";

        jewelleryOverlay.style.height =
            "180px";

        jewelleryOverlay.style.left =
            "50%";

        jewelleryOverlay.style.top =
            "72%";

        jewelleryOverlay.style.transform =
            "translate(-50%, -50%)";

    }


    else {

        jewelleryOverlay.style.width =
            "250px";

        jewelleryOverlay.style.height =
            "250px";

        jewelleryOverlay.style.left =
            "50%";

        jewelleryOverlay.style.top =
            "50%";

        jewelleryOverlay.style.transform =
            "translate(-50%, -50%)";

    }

}


/* =====================================================
   START AR
===================================================== */

function startAR() {

    cancelAnimationFrame(
        animationFrame
    );


    function render() {

        if (
            !arModal.classList.contains(
                "active"
            )
        ) {

            return;
        }


        positionJewellery();


        animationFrame =
            requestAnimationFrame(
                render
            );

    }


    render();

}


/* =====================================================
   CLOSE AR
===================================================== */

function closeAR() {

    console.log(
        "Closing AR"
    );


    /* Stop animation */

    cancelAnimationFrame(
        animationFrame
    );


    /* Stop camera */

    stopCamera();


    /* Remove modal */

    arModal.classList.remove(
        "active"
    );


    /* Remove jewellery */

    jewelleryOverlay.style.display =
        "none";


    jewelleryOverlay.src = "";


    /* Clear canvas */

    ctx.clearRect(
        0,
        0,
        arCanvas.width,
        arCanvas.height
    );


    selectedProduct = null;

}


/* =====================================================
   STOP CAMERA
===================================================== */

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

        cameraStream = null;

    }


    cameraVideo.srcObject =
        null;

}


/* =====================================================
   CLOSE BUTTON
===================================================== */

closeARBtn.addEventListener(
    "click",
    closeAR
);


/* =====================================================
   CLICK OUTSIDE CAMERA
===================================================== */

arModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === arModal
        ) {

            closeAR();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeAR();

        }

    }
);


/* =====================================================
   CAMERA RESIZE
===================================================== */

window.addEventListener(
    "resize",
    function() {

        positionJewellery();

    }
);


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            product =>
                product.id === id
        );


    if (!product) {

        return;
    }


    const existing =
        cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        existing.qty++;

    }

    else {

        cart.push({

            ...product,

            qty: 1

        });

    }


    console.log(
        "Cart:",
        cart
    );


    alert(
        `${product.name} added to cart 🛒`
    );

}


/* =====================================================
   INITIAL LOAD
===================================================== */

displayProducts(
    products
);