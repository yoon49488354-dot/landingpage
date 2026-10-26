$(function () {

    // Section 3 찾기
    const crafted = document.querySelector(".crafted");

    // 연결선을 가지고 있는 설명 박스 3개 찾기
    const texts = document.querySelectorAll(
        ".crafted1, .crafted2, .crafted3"
    );

    if (!crafted || texts.length === 0) return;

    // 스크롤 감지
    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                // SUPPORT → MOVE → FITTED SEAT
                texts.forEach(function (text, index) {

                    setTimeout(function () {
                        text.classList.add("show-line");
                    }, 1700 + index * 350);

                });

                // 한 번 실행한 후 감지 종료
                observer.unobserve(crafted);
            }

        });

    }, {
        threshold: 0.1
    });

    observer.observe(crafted);


});