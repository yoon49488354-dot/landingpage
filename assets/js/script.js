
$(document).ready(function () {

    // ====================================
    // Section 3 애니메이션
    // ====================================

    var $crafted = $('.crafted');

    // Section 3 연결선 요소
    var $texts = $('.crafted1, .crafted2, .crafted3');

    var isCraftedAnimating = false;
    var isCraftedDone = false;
    var isLineStarted = false;

    if ($crafted.length) {

        // 헤더 높이를 반영한 스크롤 위치 계산
        function getTargetScroll() {
            var headerHeight = $('.site-header').outerHeight() || 80;
            return Math.round($crafted.offset().top - headerHeight);
        }

        // 연결선 순차 등장
        function startLineAnimation() {

            if (isLineStarted) return;

            isLineStarted = true;

            $texts.each(function (index) {

                var $text = $(this);

                setTimeout(function () {
                    $text.addClass('show-line');
                }, 950 + index * 350);

            });
        }

        // Section 3 전체 애니메이션 시작
        function startCraftedAnimation() {

            if (isCraftedDone || isCraftedAnimating) return;

            isCraftedAnimating = true;

            // 기존 설명 텍스트 애니메이션 시작
            $crafted.addClass('active');

            // 연결선 애니메이션 시작
            startLineAnimation();

            var targetScroll = getTargetScroll();

            // Section 3 위치로 이동
            $('html, body').stop().animate({
                scrollTop: targetScroll
            }, 250);

            // 설명 텍스트가 등장할 때까지 유지
            setTimeout(function () {

                isCraftedAnimating = false;
                isCraftedDone = true;

            }, 2600);
        }

        // 페이지를 처음 열었을 때 Section 3을 이미 지나친 경우
        if ($(window).scrollTop() > getTargetScroll() + 250) {

            isCraftedDone = true;

            $crafted.addClass('active');

            // 완료 상태로 표시
            $texts.addClass('show-line');
            isLineStarted = true;
        }

        // 스크롤 위치 감지
        function handleCraftedScroll() {

            if (isCraftedDone || isCraftedAnimating) return;

            var scrollTop = $(window).scrollTop();
            var targetScroll = getTargetScroll();

            if (
                scrollTop >= targetScroll - 100 &&
                scrollTop <= targetScroll + 350
            ) {
                startCraftedAnimation();
            }
        }

        // 스크롤 이벤트
        $(window).on('scroll', function () {

            handleCraftedScroll();

            if (isCraftedAnimating) {

                var targetScroll = getTargetScroll();

                if ($(window).scrollTop() > targetScroll + 5) {
                    $(window).scrollTop(targetScroll);
                }
            }
        });

        // IntersectionObserver로 Section 3 진입 감지
        if ('IntersectionObserver' in window) {

            var observer = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting && !isCraftedDone) {

                        handleCraftedScroll();

                    }
                });

            }, {
                threshold: 0.15
            });

            observer.observe($crafted[0]);
        }

        // 애니메이션 중 스크롤 제한
        function preventScrollWhileAnimating(e) {

            if (!isCraftedAnimating) return;

            if (e.type === 'wheel') {

                if (e.deltaY > 0) {
                    e.preventDefault();
                }

            } else if (e.type === 'touchmove') {

                e.preventDefault();

            } else if (e.type === 'keydown') {

                if (
                    ['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp']
                    .indexOf(e.key) !== -1
                ) {
                    e.preventDefault();
                }
            }
        }

        window.addEventListener(
            'wheel',
            preventScrollWhileAnimating,
            { passive: false }
        );

        window.addEventListener(
            'touchmove',
            preventScrollWhileAnimating,
            { passive: false }
        );

        window.addEventListener(
            'keydown',
            preventScrollWhileAnimating,
            { passive: false }
        );

        // 최초 진입 시에도 감지
        handleCraftedScroll();
    }


    // ====================================
    // Section 4 카드 뒤집기
    // ====================================

    $('.feature-card').on('click', function () {

        $(this).toggleClass('flipped');

    });

});

