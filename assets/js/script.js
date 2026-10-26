$(document).ready(function () {
    var $crafted = $('.crafted');
    if (!$crafted.length) return;

    var isCraftedAnimating = false;
    var isCraftedDone = false;

    // 헤더 높이를 반영한 Section 3 타겟 스크롤 위치 계산
    function getTargetScroll() {
        var headerHeight = $('.site-header').outerHeight() || 80;
        return Math.round($crafted.offset().top - headerHeight);
    }

    // 초기 페이지 로드 시 이미 3페이지를 지나쳐 있는 경우 잠금 건너뛰기
    if ($(window).scrollTop() > getTargetScroll() + 250) {
        isCraftedDone = true;
        $crafted.addClass('active');
    }

    // 3페이지 스크롤 감지 및 애니메이션 진행 중 머무름(Lock) 처리
    function handleCraftedScroll() {
        if (isCraftedDone || isCraftedAnimating) return;

        var scrollTop = $(window).scrollTop();
        var targetScroll = getTargetScroll();

        // 3페이지가 헤더 아래 시야에 들어왔을 때
        if (scrollTop >= targetScroll - 100 && scrollTop <= targetScroll + 350) {
            isCraftedAnimating = true;
            $crafted.addClass('active');

            // 3페이지 위치로 부드럽게 정렬
            $('html, body').stop().animate({ scrollTop: targetScroll }, 250);

            // 모든 설명 텍스트가 완전히 나오는 시간(약 2.6초) 동안 섹션 머물기
            setTimeout(function () {
                isCraftedAnimating = false;
                isCraftedDone = true;
            }, 2600);
        }
    }

    // 스크롤 이벤트
    $(window).on('scroll', function () {
        handleCraftedScroll();

        // 애니메이션 진행 중에 스크롤바 드래그 등으로 내려가는 것 방지
        if (isCraftedAnimating) {
            var targetScroll = getTargetScroll();
            if ($(window).scrollTop() > targetScroll + 5) {
                $(window).scrollTop(targetScroll);
            }
        }
    });

    // 화면 진입 즉시 감지를 위한 IntersectionObserver
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    $crafted.addClass('active');
                    handleCraftedScroll();
                }
            });
        }, { threshold: 0.15 });
        observer.observe($crafted[0]);
    }

    // 마우스 휠, 터치, 키보드 입력 시 모든 설명이 나올 때까지 아래로 내려가지 않도록 제어
    function preventScrollWhileAnimating(e) {
        if (isCraftedAnimating) {
            if (e.type === 'wheel') {
                // 아래로 스크롤 방지
                if (e.deltaY > 0) {
                    e.preventDefault();
                }
            } else if (e.type === 'touchmove') {
                e.preventDefault();
            } else if (e.type === 'keydown') {
                if (['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp'].indexOf(e.key) !== -1) {
                    e.preventDefault();
                }
            }
        }
    }

    window.addEventListener('wheel', preventScrollWhileAnimating, { passive: false });
    window.addEventListener('touchmove', preventScrollWhileAnimating, { passive: false });
    window.addEventListener('keydown', preventScrollWhileAnimating, { passive: false });

    // 4페이지 (FEATURES) 카드 클릭/터치 시 플립 토글 (모바일 및 데스크톱 지원)
    $('.feature-card').on('click', function () {
        $(this).toggleClass('flipped');
    });
});
