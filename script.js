/* =====================================================
   DOM
===================================================== */

const coverScreen =
    document.getElementById("coverScreen");

const wishlistScreen =
    document.getElementById("wishlistScreen");

const startButton =
    document.getElementById("startButton");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    document.getElementById("musicIcon");

const musicText =
    document.getElementById("musicText");

const infoButton =
    document.getElementById("infoButton");

const personalModal =
    document.getElementById("personalModal");

const openPersonal =
    document.getElementById("openPersonal");

const guideClose =
    document.getElementById("guideClose");

const giftModal =
    document.getElementById("giftModal");

const modalClose =
    document.getElementById("modalClose");

const giftOverlay =
    document.getElementById("giftOverlay");

const personalCloseButtons =
    document.querySelectorAll(
        "[data-close-personal]"
    );

const album =
    document.getElementById("album");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const itemCount =
    document.getElementById("itemCount");



/* =====================================================
   CỬA SỔ 01 → CỬA SỔ 02
===================================================== */

startButton.addEventListener(
    "click",
    () => {

        coverScreen.style.display = "none";

        wishlistScreen.classList.add("show");

        document.body.style.overflowX = "hidden";


        /*
         * Quan trọng:
         *
         * Trình duyệt thường chặn autoplay.
         * Nhưng vì người dùng vừa click nút,
         * trình duyệt cho phép phát nhạc.
         */

        backgroundMusic.volume = 0.35;

        backgroundMusic
            .play()
            .then(() => {

                updateMusicButton(true);

            })
            .catch(() => {

                updateMusicButton(false);

            });


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }
);



/* =====================================================
   NHẠC
===================================================== */

function updateMusicButton(isPlaying) {

    if (isPlaying) {

        musicIcon.textContent = "♫";

        musicText.textContent = "Đang phát";

    } else {

        musicIcon.textContent = "♪";

        musicText.textContent = "Bật nhạc";

    }

}


musicButton.addEventListener(
    "click",
    () => {

        if (backgroundMusic.paused) {

            backgroundMusic
                .play()
                .then(() => {

                    updateMusicButton(true);

                });

        } else {

            backgroundMusic.pause();

            updateMusicButton(false);

        }

    }
);


/*
 * Đảm bảo nhạc lặp.
 */

backgroundMusic.addEventListener(
    "ended",
    () => {

        backgroundMusic.currentTime = 0;

        backgroundMusic.play();

    }
);



/* =====================================================
   ĐÓNG HƯỚNG DẪN
===================================================== */

guideClose.addEventListener(
    "click",
    () => {

        guideClose
            .closest(".guide-box")
            .style.display = "none";

    }
);



/* =====================================================
   FILTER
===================================================== */

const filters =
    document.querySelectorAll(".filter");

const cards =
    document.querySelectorAll(".gift-card");


filters.forEach(
    filter => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add("active");


                const category =
                    filter.dataset.filter;


                let visibleCount = 0;


                cards.forEach(
                    card => {

                        const cardCategory =
                            card.dataset.category;


                        const shouldShow =
                            category === "all" ||
                            cardCategory === category;


                        if (shouldShow) {

                            card.classList.remove(
                                "hidden"
                            );

                            visibleCount++;

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


                itemCount.textContent =
                    `${visibleCount} món`;

            }
        );

    }
);



/* =====================================================
   MỞ POPUP SẢN PHẨM
===================================================== */

const modalImage =
    document.getElementById("modalImage");

const modalName =
    document.getElementById("modalName");

const modalCategory =
    document.getElementById("modalCategory");

const modalDescription =
    document.getElementById("modalDescription");

const modalPrice =
    document.getElementById("modalPrice");

const modalPriority =
    document.getElementById("modalPriority");

const modalLink =
    document.getElementById("modalLink");


cards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const name =
                    card.dataset.name;

                const price =
                    card.dataset.price;

                const priority =
                    card.dataset.priority;

                const icon =
                    card.dataset.icon;

                const description =
                    card.dataset.description;

                const link =
                    card.dataset.link;

                const image =
                    card.dataset.image;

                const category =
                    card
                        .querySelector(".card-meta span")
                        .textContent;


                modalImage.src = image;

                modalImage.alt = name;

                modalName.textContent =
                    name;

                modalCategory.textContent =
                    category;

                modalDescription.textContent =
                    description;

                modalPrice.textContent =
                    price;

                modalPriority.textContent =
                    `${icon} ${priority}`;


                if (
                    link === "#" ||
                    !link
                ) {

                    modalLink.style.display =
                        "none";

                } else {

                    modalLink.style.display =
                        "flex";

                    modalLink.href =
                        link;

                }


                giftModal.classList.add(
                    "show"
                );


                document.body.style.overflow =
                    "hidden";

            }
        );

    }
);



/* =====================================================
   ĐÓNG POPUP SẢN PHẨM
===================================================== */

function closeGiftModal() {

    giftModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


modalClose.addEventListener(
    "click",
    closeGiftModal
);


giftOverlay.addEventListener(
    "click",
    closeGiftModal
);



/* =====================================================
   POPUP THÔNG TIN CÁ NHÂN
===================================================== */

function openPersonalModal() {

    personalModal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


function closePersonalModal() {

    personalModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


infoButton.addEventListener(
    "click",
    openPersonalModal
);


openPersonal.addEventListener(
    "click",
    openPersonalModal
);


personalCloseButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            closePersonalModal
        );

    }
);



/* =====================================================
   PHÍM ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeGiftModal();

            closePersonalModal();

        }

    }
);



/* =====================================================
   NÚT KÉO ALBUM TRÊN PC
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        album.scrollBy({

            left: 700,

            behavior: "smooth"

        });

    }
);


previousButton.addEventListener(
    "click",
    () => {

        album.scrollBy({

            left: -700,

            behavior: "smooth"

        });

    }
);



/* =====================================================
   KÉO ALBUM BẰNG CHUỘT
===================================================== */

let isDown = false;

let startX;

let scrollLeft;


album.addEventListener(
    "mousedown",
    event => {

        isDown = true;

        album.style.cursor =
            "grabbing";

        startX =
            event.pageX -
            album.offsetLeft;

        scrollLeft =
            album.scrollLeft;

    }
);


album.addEventListener(
    "mouseleave",
    () => {

        isDown = false;

        album.style.cursor =
            "";

    }
);


album.addEventListener(
    "mouseup",
    () => {

        isDown = false;

        album.style.cursor =
            "";

    }
);


album.addEventListener(
    "mousemove",
    event => {

        if (!isDown) {
            return;
        }


        event.preventDefault();


        const x =
            event.pageX -
            album.offsetLeft;


        const walk =
            (x - startX) * 1.5;


        album.scrollLeft =
            scrollLeft - walk;

    }
);



/* =====================================================
   TOUCH — MOBILE
===================================================== */

let touchStartX = 0;

let touchEndX = 0;


album.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


album.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);


function handleSwipe() {

    const difference =
        touchStartX - touchEndX;


    if (Math.abs(difference) < 50) {
        return;
    }


    if (difference > 0) {

        album.scrollBy({

            left: 300,

            behavior: "smooth"

        });

    } else {

        album.scrollBy({

            left: -300,

            behavior: "smooth"

        });

    }

}
