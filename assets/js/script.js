
gsap.version

$(function () {

    // 햄버거 버튼 클릭
    $(".menu-btn").click(function () {

        $(this).toggleClass("on");

        $(".header-nav").stop().slideToggle(300);

        const isOpen = $(this).hasClass("on");

        $(this).attr("aria-expanded", isOpen);
        $(this).attr(
            "aria-label",
            isOpen ? "메뉴 닫기" : "메뉴 열기"
        );

    });

    // 모바일 → 태블릿/PC 전환 시 초기화
    $(window).resize(function () {

        if ($(window).width() > 767) {

            $(".header-nav").stop().removeAttr("style");

            $(".menu-btn")
                .removeClass("on")
                .attr("aria-expanded", "false")
                .attr("aria-label", "메뉴 열기");
        }

    });



    // ===================================
    // Hero 타이틀 등장 애니메이션
    // ===================================

    gsap.from(".main-text", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });


    // ======================================
    // Hero 키워드 순차등장 + 연결형 웨이브 Hover
    // ======================================
    gsap.from(".hero-point li", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 1,
        stagger: 0.15,
        ease: "power2.out"
    });



    // Hero 키워드 연결형 웨이브 Hover
    const keywords = $(".hero-point li");

    $(".hero-point").on("mouseenter", function () {

        // 중복 실행 방지
        if ($(this).data("wavePlaying")) return;

        $(this).data("wavePlaying", true);

        const timeline = gsap.timeline({
            onComplete: () => {
                $(".hero-point").data("wavePlaying", false);
            }
        });

        // 각 키워드가 순서대로 올라갔다 바로 내려오기
        keywords.each(function (index) {

            const startTime = index * 0.12;

            timeline.to(this, {
                y: -35,
                duration: 0.5,
                ease: "sine.out"
            }, startTime);

            timeline.to(this, {
                y: 0,
                duration: 0.5,
                ease: "sine.in"
            }, startTime + 0.5);

        });

    });


});

