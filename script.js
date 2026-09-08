/* ============================================================
   SHEPIS WISHLIST
   FILE: script.js

   File này xử lý toàn bộ chức năng tương tác của website:
   - Chuyển từ trang bìa sang trang wishlist
   - Bật / tắt nhạc nền
   - Hiển thị thông báo khi nhạc thay đổi trạng thái
   - Mở / đóng hồ sơ Shepis
   - Mở / đóng chi tiết từng món quà
   - Lọc sản phẩm theo danh mục
   - Sắp xếp sản phẩm theo giá / độ yêu thích
   - Hệ thống thả tim giả lập bằng LocalStorage
   - Hiển thị số lượng sản phẩm
   - Nút quay lại đầu trang
   - Kéo ngang danh sách sản phẩm trên máy tính
   - Ngăn trình duyệt kéo ảnh ra ngoài
============================================================ */


/* ============================================================
   1. LẤY CÁC PHẦN TỬ HTML
   ------------------------------------------------------------
   Các biến dưới đây dùng để kết nối JavaScript với những
   thành phần tương ứng trong file HTML.
============================================================ */

const coverScreen = document.getElementById("coverScreen");
const wishlistScreen = document.getElementById("wishlistScreen");
const startButton = document.getElementById("startButton");

const loader = document.getElementById("pageLoader");
const mainScreen = document.getElementById("mainScreen");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicToast = document.getElementById("musicToast");

const profileButton = document.getElementById("profileButton");
const profileButtonTwo = document.getElementById("profileButtonTwo");

const profileModal = document.getElementById("profileModal");
const giftModal = document.getElementById("giftModal");

const themeButton = document.getElementById("themeButton");

const guideClose = document.getElementById("guideClose");

const sortSelect = document.getElementById("sortSelect");

const album = document.getElementById("album");

const backTop = document.getElementById("backTop");

const restartButton = document.getElementById("restartButton");

const productCount = document.getElementById("productCount");


/* ============================================================
   2. HIỆU ỨNG LOADING
   ------------------------------------------------------------
   Khi website tải xong, màn hình loading sẽ được ẩn đi
   sau khoảng 0,7 giây.

   Mục đích:
   - Tạo cảm giác chuyển trang mượt hơn.
   - Tránh người dùng nhìn thấy website đang tải dở.
============================================================ */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (loader) {
            loader.classList.add("hidden");
        }

    }, 700);

});


/* ============================================================
   3. PHÁT NHẠC SAU LẦN TƯƠNG TÁC ĐẦU TIÊN
   ------------------------------------------------------------
   Trình duyệt thường không cho website tự động phát nhạc
   khi người dùng chưa tương tác.

   Vì vậy website sẽ chờ người dùng:
   - Click
   hoặc
   - Chạm màn hình

   Sau đó mới thử phát nhạc.

   Âm lượng mặc định: 50%.
============================================================ */

function initAudioOnInteraction() {

    if (music && music.paused) {

        music.volume = 0.50;

        music.play()
            .then(() => {

                showMusicToast(
                    "Nhạc đang phát",
                    "Wishlist của Shepis"
                );

                updateMusicButton();

            })
            .catch(() => {

                // Trình duyệt có thể từ chối phát nhạc.
                // Khi đó không làm gì để tránh lỗi giao diện.

            });

    }

}


/*
   Chỉ chạy chức năng trên một lần ở lần click đầu tiên.
*/

window.addEventListener(
    "click",
    initAudioOnInteraction,
    { once: true }
);

window.addEventListener(
    "touchstart",
    initAudioOnInteraction,
    { once: true }
);


/* ============================================================
   4. HỆ THỐNG NHẠC
   ------------------------------------------------------------
   Nút nhạc cho phép người dùng:
   - Bật nhạc
   - Tắt nhạc

   Nội dung nút sẽ thay đổi theo trạng thái hiện tại.
============================================================ */

function updateMusicButton() {

    if (!music || !musicButton) {
        return;
    }

    if (music.paused) {

        musicButton.innerHTML =
            "♫ <span class='desktop-only'>Bật nhạc</span>";

    } else {

        musicButton.innerHTML =
            "♫ <span class='desktop-only'>Tắt nhạc</span>";

    }

}


/*
   Khi người dùng nhấn nút nhạc:
   - Nếu đang tắt → bật
   - Nếu đang bật → tắt
*/

if (musicButton) {

    musicButton.addEventListener("click", async () => {

        if (!music) {
            return;
        }

        if (music.paused) {

            try {

                await music.play();

                showMusicToast(
                    "Nhạc đang phát",
                    "Wishlist của Shepis"
                );

            } catch (error) {

                console.log(
                    "Không thể phát nhạc:",
                    error
                );

            }

        } else {

            music.pause();

            showMusicToast(
                "Đã tắt nhạc",
                "Bấm ♫ để bật lại"
            );

        }

        updateMusicButton();

    });

}


/* ============================================================
   5. THÔNG BÁO NHẠC
   ------------------------------------------------------------
   Hiển thị một thông báo nhỏ ở màn hình khi:
   - Nhạc được bật
   - Nhạc được tắt

   Thông báo tự biến mất sau 3,5 giây.
============================================================ */

function showMusicToast(title, subtitle) {

    if (!musicToast) {
        return;
    }

    const strong =
        musicToast.querySelector("strong");

    const small =
        musicToast.querySelector("small");


    if (strong) {
        strong.textContent = title;
    }

    if (small) {
        small.textContent = subtitle;
    }


    musicToast.classList.add("show");


    /*
       Nếu người dùng bật / tắt liên tục,
       timer cũ sẽ được xóa để tránh nhiều timer chạy cùng lúc.
    */

    clearTimeout(window.musicToastTimer);


    window.musicToastTimer = setTimeout(() => {

        musicToast.classList.remove("show");

    }, 3500);

}


/* ============================================================
   6. HỆ THỐNG MODAL
   ------------------------------------------------------------
   Modal là các cửa sổ bật lên ở giữa màn hình.

   Website hiện có:
   - Modal hồ sơ Shepis
   - Modal chi tiết món quà

   Khi modal mở:
   - Thêm class "active"
   - Khóa cuộn trang phía sau
============================================================ */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


/*
   Đóng modal và cho phép cuộn trang trở lại.
*/

function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


/* ============================================================
   7. MỞ HỒ SƠ SHEPIS
   ------------------------------------------------------------
   Có hai nút mở hồ sơ:
   - Nút trên thanh điều hướng
   - Nút trong phần giới thiệu hồ sơ
============================================================ */

if (profileButton) {

    profileButton.addEventListener(
        "click",
        () => openModal(profileModal)
    );

}


if (profileButtonTwo) {

    profileButtonTwo.addEventListener(
        "click",
        () => openModal(profileModal)
    );

}


/* ============================================================
   8. ĐÓNG MODAL
   ------------------------------------------------------------
   Người dùng có thể đóng modal bằng:
   - Nút X
   - Click vào vùng nền phía sau
   - Phím ESC
============================================================ */


/*
   Đóng bằng các nút có:
   data-close="tên-modal"
*/

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const modalID =
                button.dataset.close;

            const modal =
                document.getElementById(modalID);

            closeModal(modal);

        });

    });


/*
   Đóng khi click vào vùng nền tối phía sau modal.
*/

document
    .querySelectorAll(".modal-backdrop")
    .forEach(backdrop => {

        backdrop.addEventListener("click", () => {

            const modal =
                backdrop.closest(".modal");

            closeModal(modal);

        });

    });


/*
   Đóng tất cả modal đang mở bằng phím ESC.
*/

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }

    document
        .querySelectorAll(".modal.active")
        .forEach(modal => {

            closeModal(modal);

        });

});


/* ============================================================
   9. LẤY DANH SÁCH CÁC CARD QUÀ TẶNG
   ------------------------------------------------------------
   Mỗi sản phẩm trong HTML có class:
   .gift-card

   JavaScript lấy toàn bộ các card này thành một mảng
   để thực hiện:
   - Lọc
   - Sắp xếp
   - Thả tim
   - Mở chi tiết
============================================================ */

const giftCards =
    Array.from(
        document.querySelectorAll(".gift-card")
    );


/* ============================================================
   10. CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
   ------------------------------------------------------------
   Khi người dùng lọc danh mục, số lượng sản phẩm đang hiển thị
   sẽ được cập nhật lại trên phần đầu trang.

   Ví dụ:
   Tất cả → 08
   Công nghệ → 02
============================================================ */

function updateProductCount() {

    const visible =
        giftCards.filter(card => {

            return !card.classList.contains("hidden");

        }).length;


    if (productCount) {

        productCount.textContent =
            String(visible).padStart(2, "0");

    }

}


/*
   Cập nhật số lượng ngay khi website khởi động.
*/

updateProductCount();


/* ============================================================
   11. HỆ THỐNG LỌC SẢN PHẨM
   ------------------------------------------------------------
   Người dùng có thể lọc theo:
   - Tất cả
   - Quần áo
   - Giày
   - Công nghệ
   - Dưỡng da
   - Đồ vô tri
   - Gia dụng
   - Trải nghiệm
   - Thích lâu rồi

   Danh mục được xác định bằng:
   data-category="..."
============================================================ */

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {


        /*
           Xóa trạng thái active của tất cả nút.
        */

        filterButtons.forEach(item => {

            item.classList.remove("active");

        });


        /*
           Đánh dấu nút hiện tại là đang được chọn.
        */

        button.classList.add("active");


        /*
           Lấy danh mục mà người dùng muốn lọc.
        */

        const filter =
            button.dataset.filter;


        /*
           Kiểm tra từng sản phẩm.
        */

        giftCards.forEach(card => {

            const category =
                card.dataset.category;


            /*
               Nếu chọn "all" → hiện tất cả.

               Nếu danh mục sản phẩm trùng với bộ lọc
               → hiện sản phẩm.

               Nếu không trùng → ẩn sản phẩm.
            */

            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });


        /*
           Sau khi lọc → cập nhật số lượng sản phẩm.
        */

        updateProductCount();

    });

});


/* ============================================================
   12. HỆ THỐNG SẮP XẾP
   ------------------------------------------------------------
   Các lựa chọn hiện tại:
   - Mặc định
   - Giá thấp → cao
   - Giá cao → thấp
   - Độ yêu thích

   Dữ liệu lấy trực tiếp từ các thuộc tính:
   data-price-min
   data-price-max
   data-rating
============================================================ */

if (sortSelect) {

    sortSelect.addEventListener("change", () => {

        const value =
            sortSelect.value;


        /*
           Tạo bản sao mảng để không làm mất thứ tự gốc.
        */

        const sorted =
            [...giftCards];


        /* ----------------------------------------------------
           Sắp xếp giá thấp → cao
        ---------------------------------------------------- */

        if (value === "price-low") {

            sorted.sort((a, b) => {

                return (
                    Number(a.dataset.priceMin) -
                    Number(b.dataset.priceMin)
                );

            });

        }


        /* ----------------------------------------------------
           Sắp xếp giá cao → thấp
        ---------------------------------------------------- */

        if (value === "price-high") {

            sorted.sort((a, b) => {

                return (
                    Number(b.dataset.priceMax) -
                    Number(a.dataset.priceMax)
                );

            });

        }


        /* ----------------------------------------------------
           Sắp xếp theo độ yêu thích
        ---------------------------------------------------- */

        if (value === "rating") {

            sorted.sort((a, b) => {

                return (
                    Number(b.dataset.rating) -
                    Number(a.dataset.rating)
                );

            });

        }


        /* ----------------------------------------------------
           Trở về thứ tự ban đầu
        ---------------------------------------------------- */

        if (value === "default") {

            sorted.sort((a, b) => {

                return (
                    giftCards.indexOf(a) -
                    giftCards.indexOf(b)
                );

            });

        }


        /*
           Đưa các card đã sắp xếp trở lại album.
        */

        sorted.forEach(card => {

            album.appendChild(card);

        });

    });

}


/* ============================================================
   13. HỆ THỐNG THẢ TIM GIẢ LẬP
   ------------------------------------------------------------
   Website KHÔNG sử dụng:
   - Server
   - Database
   - Supabase

   Thay vào đó sử dụng LocalStorage của trình duyệt.

   Vì vậy:
   - Người dùng thả tim → trạng thái được lưu.
   - F5 trang → trạng thái vẫn còn.
   - Dữ liệu chỉ tồn tại trên trình duyệt của người dùng.
============================================================ */


/*
   Tạo khóa lưu trạng thái đã thích / chưa thích.
*/

function getLikeKey(card) {

    return (
        "shepis_like_" +
        card.dataset.name
    );

}


/*
   Tạo khóa lưu số lượng tim.
*/

function getLikeCountKey(card) {

    return (
        "shepis_like_count_" +
        card.dataset.name
    );

}


/* ============================================================
   14. LẤY SỐ TIM BAN ĐẦU
   ------------------------------------------------------------
   Nếu sản phẩm chưa từng được lưu:
   → tạo một số tim giả lập ngẫu nhiên từ 5 đến 84.

   Sau đó lưu lại LocalStorage để số tim không thay đổi
   mỗi lần tải lại trang.
============================================================ */

function getInitialCount(card) {

    const key =
        getLikeCountKey(card);


    const saved =
        localStorage.getItem(key);


    /*
       Nếu đã có dữ liệu → sử dụng dữ liệu cũ.
    */

    if (saved !== null) {

        return Number(saved);

    }


    /*
       Nếu chưa có → tạo số tim giả lập.
    */

    const count =
        Math.floor(Math.random() * 80) + 5;


    /*
       Lưu số tim vào trình duyệt.
    */

    localStorage.setItem(
        key,
        count
    );


    return count;

}


/* ============================================================
   15. CẬP NHẬT TRẠNG THÁI TIM TRÊN CARD
   ------------------------------------------------------------
   Hàm này kiểm tra:
   - Người dùng đã thích món này chưa?
   - Có bao nhiêu lượt thích?

   Sau đó cập nhật:
   - Biểu tượng ♡ / ♥
   - Số lượt thích
   - Class "liked"
============================================================ */

function updateCardLike(card) {

    const button =
        card.querySelector(".like-button");


    if (!button) {
        return;
    }


    const heart =
        button.querySelector(".heart");


    const count =
        button.querySelector(".like-count");


    /*
       Kiểm tra trạng thái thích.
    */

    const liked =
        localStorage.getItem(
            getLikeKey(card)
        ) === "true";


    /*
       Lấy số lượt thích.
    */

    const likeCount =
        getInitialCount(card);


    /*
       Thêm / xóa class liked.
    */

    button.classList.toggle(
        "liked",
        liked
    );


    /*
       Đổi biểu tượng trái tim.
    */

    if (heart) {

        heart.textContent =
            liked ? "♥" : "♡";

    }


    /*
       Cập nhật số lượt thích.
    */

    if (count) {

        count.textContent =
            likeCount;

    }

}


/* ============================================================
   16. GẮN SỰ KIỆN THẢ TIM CHO TỪNG CARD
============================================================ */

giftCards.forEach(card => {


    /*
       Hiển thị trạng thái tim hiện tại.
    */

    updateCardLike(card);


    const button =
        card.querySelector(".like-button");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            /*
               Không cho click vào nút tim
               kích hoạt click mở chi tiết sản phẩm.
            */

            event.stopPropagation();


            /*
               Thay đổi trạng thái thích.
            */

            toggleLike(card);

        }
    );

});


/* ============================================================
   17. BẬT / TẮT TIM
   ------------------------------------------------------------
   Khi người dùng:
   - Chưa thích → bấm → +1 tim
   - Đã thích → bấm → -1 tim

   Trạng thái được lưu vào LocalStorage.
============================================================ */

function toggleLike(card) {

    const key =
        getLikeKey(card);


    /*
       Lấy trạng thái hiện tại.
    */

    const current =
        localStorage.getItem(key) === "true";


    /*
       Đảo ngược trạng thái.
    */

    const newState =
        !current;


    /*
       Lưu trạng thái mới.
    */

    localStorage.setItem(
        key,
        newState
    );


    /*
       Lấy số tim hiện tại.
    */

    const countKey =
        getLikeCountKey(card);


    let count =
        getInitialCount(card);


    /*
       Nếu vừa thích → cộng 1.
    */

    if (newState) {

        count++;


        /*
           Chạy hiệu ứng trái tim.
        */

        animateHeart(
            card.querySelector(".like-button")
        );

    } else {

        /*
           Nếu bỏ thích → trừ 1.

           Math.max đảm bảo số tim không bao giờ âm.
        */

        count =
            Math.max(0, count - 1);

    }


    /*
       Lưu số tim mới.
    */

    localStorage.setItem(
        countKey,
        count
    );


    /*
       Cập nhật lại giao diện.
    */

    updateCardLike(card);

}


/* ============================================================
   18. HIỆU ỨNG KHI THẢ TIM
   ------------------------------------------------------------
   Trái tim phóng to nhẹ rồi trở về kích thước ban đầu.
============================================================ */

function animateHeart(button) {

    if (!button) {
        return;
    }


    button.animate(

        [
            {
                transform: "scale(1)"
            },

            {
                transform: "scale(1.25)"
            },

            {
                transform: "scale(1)"
            }
        ],

        {
            duration: 350,
            easing: "ease-out"
        }

    );

}


/* ============================================================
   19. CÁC PHẦN TỬ TRONG MODAL CHI TIẾT SẢN PHẨM
   ------------------------------------------------------------
   Khi người dùng mở một món quà,
   thông tin từ data-* của card sẽ được đưa vào modal.
============================================================ */

const modalImage =
    document.getElementById("modalImage");

const modalCategory =
    document.getElementById("modalCategory");

const modalName =
    document.getElementById("modalName");

const modalRating =
    document.getElementById("modalRating");

const modalDescription =
    document.getElementById("modalDescription");

const modalPrice =
    document.getElementById("modalPrice");

const modalPriority =
    document.getElementById("modalPriority");

const modalLink =
    document.getElementById("modalLink");

const modalLike =
    document.getElementById("modalLike");


/*
   Lưu sản phẩm hiện đang được mở.
*/

let currentGift = null;


/* ============================================================
   20. MỞ CHI TIẾT SẢN PHẨM
   ------------------------------------------------------------
   Có hai cách mở:
   1. Bấm nút "Xem"
   2. Bấm trực tiếp vào card

   Riêng nút tim sẽ không mở modal.
============================================================ */

giftCards.forEach(card => {


    /*
       Nút "Xem".
    */

    const detailButton =
        card.querySelector(".detail-button");


    if (detailButton) {

        detailButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openGift(card);

            }
        );

    }


    /*
       Click vào toàn bộ card.
    */

    card.addEventListener(
        "click",
        event => {


            /*
               Nếu click vào nút tim
               → không mở modal.
            */

            if (
                event.target.closest(
                    ".like-button"
                )
            ) {

                return;

            }


            openGift(card);

        }
    );

});


/* ============================================================
   21. ĐƯA DỮ LIỆU SẢN PHẨM VÀO MODAL
   ------------------------------------------------------------
   Dữ liệu được lấy từ HTML:

   data-image
   data-name
   data-category
   data-description
   data-price
   data-priority
   data-rating
   data-link
============================================================ */

function openGift(card) {

    currentGift = card;


    /*
       Hình ảnh sản phẩm.
    */

    if (modalImage) {

        modalImage.src =
            card.dataset.image;

        modalImage.alt =
            card.dataset.name;

    }


    /*
       Danh mục.
    */

    if (modalCategory) {

        modalCategory.textContent =
            card.dataset.category.toUpperCase();

    }


    /*
       Tên sản phẩm.
    */

    if (modalName) {

        modalName.textContent =
            card.dataset.name;

    }


    /*
       Mô tả.
    */

    if (modalDescription) {

        modalDescription.textContent =
            card.dataset.description;

    }


    /*
       Khoảng giá.
    */

    if (modalPrice) {

        modalPrice.textContent =
            card.dataset.price;

    }


    /*
       Mức độ yêu thích.
    */

    if (modalPriority) {

        modalPriority.textContent =
            card.dataset.priority;

    }


    /*
       Hiển thị biểu tượng rating.
    */

    if (modalRating) {

        modalRating.textContent =
            getRatingIcons(
                Number(card.dataset.rating)
            );

    }


    /* --------------------------------------------------------
       XỬ LÝ LINK SẢN PHẨM
       --------------------------------------------------------
       Nếu sản phẩm có link thật:
       → hiển thị nút "Xem sản phẩm".

       Nếu link là "#":
       → ẩn nút.
    -------------------------------------------------------- */

    if (modalLink) {

        if (
            card.dataset.link &&
            card.dataset.link !== "#"
        ) {

            modalLink.href =
                card.dataset.link;

            modalLink.style.display =
                "block";

        } else {

            modalLink.style.display =
                "none";

        }

    }


    /*
       Cập nhật trạng thái tim trong modal.
    */

    updateModalLike();


    /*
       Mở modal.
    */

    openModal(giftModal);

}


/* ============================================================
   22. HIỂN THỊ MỨC ĐỘ YÊU THÍCH
   ------------------------------------------------------------
   Rating từ 1 → 5 sẽ tương ứng với biểu tượng:

   1 = 💭
   2 = 🌱
   3 = 😎
   4 = ⚡
   5 = 🔥
============================================================ */

function getRatingIcons(rating) {

    const icons = [
        "💭",
        "🌱",
        "😎",
        "⚡",
        "🔥"
    ];


    /*
       Giới hạn rating trong khoảng 1–5
       để tránh lỗi nếu dữ liệu HTML bị nhập sai.
    */

    const safeRating =
        Math.min(
            5,
            Math.max(1, rating)
        );


    return icons[safeRating - 1]
        .repeat(safeRating);

}


/* ============================================================
   23. NÚT THẢ TIM TRONG MODAL
   ------------------------------------------------------------
   Nút này sử dụng chung hệ thống tim với card.

   Vì vậy:
   - Thả tim trong card → modal cũng cập nhật.
   - Thả tim trong modal → card cũng cập nhật.
============================================================ */

if (modalLike) {

    modalLike.addEventListener(
        "click",
        () => {

            if (!currentGift) {
                return;
            }


            /*
               Thay đổi trạng thái thích.
            */

            toggleLike(currentGift);


            /*
               Cập nhật lại nút tim trong modal.
            */

            updateModalLike();

        }
    );

}


/* ============================================================
   24. CẬP NHẬT NÚT TIM TRONG MODAL
============================================================ */

function updateModalLike() {

    if (
        !currentGift ||
        !modalLike
    ) {

        return;

    }


    /*
       Kiểm tra sản phẩm hiện tại đã được thích chưa.
    */

    const liked =
        localStorage.getItem(
            getLikeKey(currentGift)
        ) === "true";


    /*
       Thêm / xóa trạng thái liked.
    */

    modalLike.classList.toggle(
        "liked",
        liked
    );


    /*
       Thay đổi nội dung nút.
    */

    if (liked) {

        modalLike.innerHTML =
            "♥ <span>Đã thích món này</span>";

    } else {

        modalLike.innerHTML =
            "♡ <span>Thích món này</span>";

    }

}


/* ============================================================
   25. GIAO DIỆN
   ------------------------------------------------------------
   Phần này trước đây dùng nút chuyển Dark / Light.

   Website hiện tại được thiết kế với một giao diện cố định,
   không cần nút chuyển giao diện.

   Nếu HTML không còn #themeButton thì phần này sẽ tự bỏ qua.
============================================================ */

const savedTheme =
    localStorage.getItem("shepis_theme");


if (
    savedTheme === "light" &&
    document.body
) {

    document.body.classList.add("light");

}


/*
   Nếu vẫn còn themeButton trong HTML cũ,
   giữ chức năng cũ để tránh JavaScript bị lỗi.

   Khi đã xóa nút Giao diện khỏi HTML,
   đoạn này sẽ không chạy.
*/

if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );


            const light =
                document.body.classList.contains(
                    "light"
                );


            localStorage.setItem(
                "shepis_theme",
                light
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* ============================================================
   26. ĐÓNG PHẦN HƯỚNG DẪN
   ------------------------------------------------------------
   Khi người dùng bấm dấu "×" ở phần hướng dẫn,
   khối hướng dẫn sẽ được ẩn đi.
============================================================ */

if (guideClose) {

    guideClose.addEventListener(
        "click",
        () => {

            const guide =
                guideClose.closest(".guide");


            if (guide) {

                guide.style.display =
                    "none";

            }

        }
    );

}


/* ============================================================
   27. NÚT QUAY LẠI ĐẦU TRANG
   ------------------------------------------------------------
   Khi người dùng kéo xuống quá 600px,
   nút mũi tên quay lên đầu sẽ xuất hiện.

   Khi bấm:
   → website cuộn mượt về đầu trang.
============================================================ */

window.addEventListener(
    "scroll",
    () => {

        if (!backTop) {
            return;
        }


        if (window.scrollY > 600) {

            backTop.classList.add(
                "visible"
            );

        } else {

            backTop.classList.remove(
                "visible"
            );

        }

    }
);


if (backTop) {

    backTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


if (startButton) {

    startButton.addEventListener("click", () => {

        document.body.classList.add("wishlist-open");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    });

}


/* ============================================================
   28. NÚT XEM LẠI TỪ ĐẦU
   ------------------------------------------------------------
============================================================ */

if (restartButton) {

    restartButton.addEventListener("click", () => {

        document.body.classList.remove("wishlist-open");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    });

}


/* ============================================================
   29. KÉO NGANG DANH SÁCH TRÊN MÁY TÍNH
   ------------------------------------------------------------
   Trên desktop, danh sách wishlist có thể kéo ngang
   bằng chuột.

   Cách sử dụng:
   - Giữ chuột trái
   - Kéo sang trái / phải
============================================================ */

let isDown = false;

let startX;

let scrollLeft;


/*
   Bắt đầu kéo.
*/

if (album) {

    album.addEventListener(
        "mousedown",
        event => {

            isDown = true;

            album.classList.add(
                "dragging"
            );


            startX =
                event.pageX -
                album.offsetLeft;


            scrollLeft =
                album.scrollLeft;

        }
    );


    /*
       Khi chuột rời khỏi album
       → kết thúc thao tác kéo.
    */

    album.addEventListener(
        "mouseleave",
        () => {

            isDown = false;

            album.classList.remove(
                "dragging"
            );

        }
    );


    /*
       Khi thả chuột
       → kết thúc thao tác kéo.
    */

    album.addEventListener(
        "mouseup",
        () => {

            isDown = false;

            album.classList.remove(
                "dragging"
            );

        }
    );


    /*
       Khi di chuyển chuột trong lúc đang giữ chuột.
    */

    album.addEventListener(
        "mousemove",
        event => {

            if (!isDown) {
                return;
            }


            /*
               Ngăn trình duyệt thực hiện hành động
               mặc định khi kéo.
            */

            event.preventDefault();


            const x =
                event.pageX -
                album.offsetLeft;


            /*
               Hệ số 1.4 giúp tốc độ kéo
               tự nhiên và nhanh hơn một chút.
            */

            const walk =
                (x - startX) * 1.4;


            album.scrollLeft =
                scrollLeft - walk;

        }
    );

}


/* ============================================================
   30. KHÔNG CHO KÉO ẢNH
   ------------------------------------------------------------
   Bình thường trình duyệt cho phép người dùng
   kéo ảnh ra khỏi website.

   Website tắt hành động đó để giao diện
   không bị khó chịu khi thao tác với card.
============================================================ */

document
    .querySelectorAll("img")
    .forEach(img => {

        img.addEventListener(
            "dragstart",
            event => {

                event.preventDefault();

            }
        );

    });

/* ============================================================
   KẾT THÚC FILE JAVASCRIPT
   ------------------------------------------------------------
   Toàn bộ chức năng tương tác của website được xử lý
   trong file script.js này.
============================================================ */
