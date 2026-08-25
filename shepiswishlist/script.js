/* ==================================================
   ELEMENTS
================================================== */

const album =
    document.getElementById("album");

const cards =
    document.querySelectorAll(".gift-card");

const nextButton =
    document.getElementById("nextButton");

const prevButton =
    document.getElementById("prevButton");

const filters =
    document.querySelectorAll(".filter");


/* ==================================================
   HORIZONTAL SLIDER - PC
================================================== */

nextButton.addEventListener(
    "click",
    () => {

        album.scrollBy({

            left: 390,

            behavior: "smooth"

        });

    }
);


prevButton.addEventListener(
    "click",
    () => {

        album.scrollBy({

            left: -390,

            behavior: "smooth"

        });

    }
);


/* ==================================================
   MOUSE DRAG
================================================== */

let isDown = false;

let startX;

let scrollLeft;


album.addEventListener(
    "mousedown",
    (event) => {

        if (window.innerWidth <= 700) {
            return;
        }

        isDown = true;

        album.style.cursor = "grabbing";

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

        album.style.cursor = "grab";

    }
);


album.addEventListener(
    "mouseup",
    () => {

        isDown = false;

        album.style.cursor = "grab";

    }
);


album.addEventListener(
    "mousemove",
    (event) => {

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


/* ==================================================
   FILTER
================================================== */

filters.forEach(
    (filter) => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add(
                    "active"
                );


                const category =
                    filter.dataset.filter;


                cards.forEach(
                    (card) => {

                        const cardCategory =
                            card.dataset.category;


                        if (
                            category === "all" ||
                            cardCategory === category
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }
);


/* ==================================================
   MODAL
================================================== */

const modal =
    document.getElementById("giftModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");


const modalImage =
    document.getElementById("modalImage");

const modalCategory =
    document.getElementById("modalCategory");

const modalName =
    document.getElementById("modalName");

const modalPrice =
    document.getElementById("modalPrice");

const modalPriority =
    document.getElementById("modalPriority");

const modalDescription =
    document.getElementById("modalDescription");

const modalLink =
    document.getElementById("modalLink");


/* ==================================================
   OPEN MODAL
================================================== */

cards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            (event) => {

                /*
                   Nếu click vào card
                   thì mở popup
                */

                const name =
                    card.dataset.name;

                const price =
                    card.dataset.price;

                const priority =
                    card.dataset.priority;

                const description =
                    card.dataset.description;

                const link =
                    card.dataset.link;

                const image =
                    card.dataset.image;

                const category =
                    card.dataset.category;


                modalImage.src =
                    image;

                modalImage.alt =
                    name;

                modalName.textContent =
                    name;

                modalPrice.textContent =
                    price;

                modalPriority.textContent =
                    priority;

                modalDescription.textContent =
                    description;

                modalCategory.textContent =
                    category.toUpperCase();


                if (
                    link &&
                    link !== "#"
                ) {

                    modalLink.href =
                        link;

                    modalLink.style.display =
                        "flex";

                } else {

                    modalLink.style.display =
                        "none";

                }


                modal.classList.add(
                    "show"
                );


                document.body.style.overflow =
                    "hidden";

            }
        );

    }
);


/* ==================================================
   CLOSE MODAL
================================================== */

function closeModal() {

    modal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


/* ==================================================
   ESC TO CLOSE
================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* ==================================================
   PREVENT LINK CLICK FROM OPENING CARD
================================================== */

modalLink.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

    }
);