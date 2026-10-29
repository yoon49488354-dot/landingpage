
$(document).ready(function () {

    // ====================================
    // 헤더 배경 전환, 스크롤 숨김/표시 및 내비게이션 제어
    // ====================================

    var $header = $('.site-header');
    var $heroAbout = $('.hero-about');

    function getHeroAboutBottom() {
        if (!$heroAbout.length) return 999999;
        return Math.round($heroAbout.offset().top + $heroAbout.outerHeight());
    }

    // 1. 스크롤 위치에 따른 헤더 배경색 및 숨김 상태 제어
    function handleHeaderScroll() {
        var scrollTop = $(window).scrollTop();
        var heroAboutBottom = getHeroAboutBottom();

        // 1-1. 스크롤이 내려가면 배경색 #1B1D18 (opacity 70%) & 블러 적용
        if (scrollTop > 20) {
            $header.addClass('header-scrolled');
        } else {
            $header.removeClass('header-scrolled');
        }

        // 1-2. hero-about 페이지를 넘어간 후부터는 헤더 숨김 (단, 모바일 메뉴 열림 시 유지)
        if (scrollTop >= heroAboutBottom - 30) {
            if (!$('.menu-btn').hasClass('on')) {
                $header.addClass('header-hidden');
            }
        } else {
            $header.removeClass('header-hidden header-peek');
        }
    }

    $(window).on('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // 2. hero-about 이후 헤더 숨김 상태에서 마우스를 화면 상단(헤더 위치)에 갖다 대면 나타나게 처리
    $(window).on('mousemove', function (e) {
        if ($header.hasClass('header-hidden')) {
            var headerHeight = $header.outerHeight() || 80;
            if (e.clientY <= 65) {
                $header.addClass('header-peek');
            } else if (e.clientY > headerHeight + 30) {
                $header.removeClass('header-peek');
            }
        }
    });

    $header.on('mouseenter', function () {
        if ($(this).hasClass('header-hidden')) {
            $(this).addClass('header-peek');
        }
    }).on('mouseleave', function () {
        var scrollTop = $(window).scrollTop();
        var heroAboutBottom = getHeroAboutBottom();
        if (scrollTop >= heroAboutBottom - 30 && !$('.menu-btn').hasClass('on')) {
            $(this).removeClass('header-peek');
        }
    });

    // 3. 햄버거 버튼 토글 및 드롭다운
    $('.menu-btn').on('click', function () {
        var $btn = $(this);
        $btn.toggleClass('on');
        if ($btn.hasClass('on')) {
            $header.addClass('header-menu-open').removeClass('header-hidden header-peek');
        } else {
            $header.removeClass('header-menu-open');
        }
        $('.header-nav').stop().slideToggle(280);
    });

    // 4. 창 크기 변경 시 모바일 메뉴 상태 초기화
    $(window).on('resize', function () {
        if ($(window).width() > 1024) {
            $('.header-nav').removeAttr('style');
            $('.menu-btn').removeClass('on');
            $header.removeClass('header-menu-open');
        }
    });

    // 5. 내비게이션 링크 클릭 시 스무스 스크롤 & 클릭 시에만 검은 배경 활성화
    $('.navi a, .logo').on('click', function (e) {
        var target = $(this).attr('href');
        if (!target || target === '#') {
            if ($(this).hasClass('logo')) {
                target = '#hero';
            } else {
                return;
            }
        }

        var $target = $(target);
        if ($target.length) {
            e.preventDefault();

            // 클릭할 때만 해당 항목에 검은 배경(.active) 표시 (시작 시에는 미표시)
            if ($(this).hasClass('logo')) {
                $('.navi a').removeClass('active');
            } else {
                $('.navi a').removeClass('active');
                $(this).addClass('active');
            }

            // 모바일 햄버거 메뉴 열려있으면 닫기
            if ($('.menu-btn').hasClass('on')) {
                $('.menu-btn').removeClass('on');
                $header.removeClass('header-menu-open');
                $('.header-nav').stop().slideUp(250);
            }

            var headerHeight = $header.outerHeight() || 80;
            var targetScroll = target === '#hero' ? 0 : Math.round($target.offset().top - headerHeight + 2);

            // 목적지가 3, 4페이지 이후인 경우 애니메이션 인터럽트 방지를 위해 완료 처리
            if (target === '#features' || target === '#contact') {
                isCraftedDone = true;
                $crafted.addClass('active');
                if (target === '#contact') {
                    isFeaturesDone = true;
                    $features.addClass('active');
                    $featureCards.addClass('aos-animate');
                }
            }

            $('html, body').stop().animate({
                scrollTop: targetScroll
            }, 600);
        }
    });


    // ====================================
    // 공통 스크롤 방지 이벤트 리스너 (Section 4만)
    // ====================================
    function preventScrollWhileAnimating(e) {

        if (!isFeaturesAnimating) return;

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

    window.addEventListener('wheel', preventScrollWhileAnimating, { passive: false });
    window.addEventListener('touchmove', preventScrollWhileAnimating, { passive: false });
    window.addEventListener('keydown', preventScrollWhileAnimating, { passive: false });


    // ====================================
    // Section 3 애니메이션 (스크롤 핀 없음)
    // ====================================

    var $crafted = $('.crafted');

    var isCraftedDone = false;

    function getCraftedTargetScroll() {
        var headerHeight = $('.site-header').outerHeight() || 80;
        return Math.round($crafted.offset().top - headerHeight);
    }

    function startCraftedAnimation() {
        if (isCraftedDone) return;

        isCraftedDone = true;
        $crafted.addClass('active');

        // 모바일/태블릿: 01~03 AOS fade-up 트리거
        if (window.matchMedia('(max-width: 1024px)').matches && window.AOS) {
            setTimeout(function () {
                AOS.refresh();
                $crafted.find('.crafted1, .crafted2, .crafted3').addClass('aos-animate');
            }, 80);
        }
    }

    function handleCraftedScroll() {
        if (!$crafted.length || isCraftedDone) return;

        var scrollTop = $(window).scrollTop();
        var targetScroll = getCraftedTargetScroll();

        if (
            scrollTop >= targetScroll - 100 &&
            scrollTop <= targetScroll + 350
        ) {
            startCraftedAnimation();
        }
    }

    if ($crafted.length) {
        if ($(window).scrollTop() > getCraftedTargetScroll() + 250) {
            isCraftedDone = true;
            $crafted.addClass('active');
            if (window.matchMedia('(max-width: 1024px)').matches) {
                $crafted.find('.crafted1, .crafted2, .crafted3').addClass('aos-animate');
            }
        }
    }


    // ====================================
    // Section 4 애니메이션 & 스크롤 제어
    // ====================================

    var $features = $('.features');
    var $featureCards = $('.feature-card');

    var isFeaturesAnimating = false;
    var isFeaturesDone = false;

    function getFeaturesTargetScroll() {
        var headerHeight = $('.site-header').outerHeight() || 80;
        return Math.round($features.offset().top - headerHeight);
    }

    function startFeaturesAnimation() {
        if (isFeaturesDone || isFeaturesAnimating) return;

        isFeaturesAnimating = true;
        $features.addClass('active');

        var targetScroll = getFeaturesTargetScroll();

        // Section 4 위치로 부드럽게 이동
        $('html, body').stop().animate({
            scrollTop: targetScroll
        }, 250);

        // 카드가 AOS animate 클래스를 확실하게 받도록 보장
        setTimeout(function () {
            if (window.AOS) {
                AOS.refresh();
            }
            $featureCards.addClass('aos-animate');
        }, 100);

        // 4개 카드가 0.25초 간격으로 모두 페이드인 완료될 때까지 스크롤 멈춤 유지
        // 딜레이(750ms) + 페이드인 지속시간(700ms) + 여유(250ms) = 1700ms
        setTimeout(function () {
            isFeaturesAnimating = false;
            isFeaturesDone = true;
        }, 1700);
    }

    function handleFeaturesScroll() {
        if (!$features.length || isFeaturesDone || isFeaturesAnimating) return;

        var scrollTop = $(window).scrollTop();
        var targetScroll = getFeaturesTargetScroll();

        if (
            scrollTop >= targetScroll - 100 &&
            scrollTop <= targetScroll + 350
        ) {
            startFeaturesAnimation();
        }
    }

    if ($features.length) {
        if ($(window).scrollTop() > getFeaturesTargetScroll() + 250) {
            isFeaturesDone = true;
            $features.addClass('active');
            $featureCards.addClass('aos-animate');
        }
    }


    // ====================================
    // 윈도우 스크롤 감지 및 위치 고정
    // ====================================

    $(window).on('scroll', function () {

        handleCraftedScroll();
        handleFeaturesScroll();

        if (isFeaturesAnimating) {
            var targetScroll = getFeaturesTargetScroll();
            if ($(window).scrollTop() > targetScroll + 5) {
                $(window).scrollTop(targetScroll);
            }
        }
    });


    // ====================================
    // IntersectionObserver로 진입 감지
    // ====================================

    if ('IntersectionObserver' in window) {

        var observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if ($crafted.length && entry.target === $crafted[0] && entry.isIntersecting && !isCraftedDone) {
                    handleCraftedScroll();
                }

                if ($features.length && entry.target === $features[0] && entry.isIntersecting && !isFeaturesDone) {
                    handleFeaturesScroll();
                }

            });

        }, {
            threshold: 0.15
        });

        if ($crafted.length) observer.observe($crafted[0]);
        if ($features.length) observer.observe($features[0]);
    }


    // 최초 진입 시에도 체크
    handleCraftedScroll();
    handleFeaturesScroll();


    // ====================================
    // Section 4 카드 뒤집기 (mouse-in 시 flip, mouseout 시 즉시 앞면 복귀)
    // ====================================

    // mouseout (mouseleave) 시 flip 상태 제거 -> CSS transition: none에 의해 회전 없이 즉시 원래 앞면으로 복귀
    $('.feature-card').on('mouseleave', function () {
        $(this).removeClass('flipped');
    });

    // 모바일 터치 대응: 탭 시 토글
    $('.feature-card').on('click', function () {
        $(this).toggleClass('flipped');
    });


    // ====================================
    // Section 5 의자 컬렉션 Swiper & 이미지 호버 연동
    // ====================================

    if ($('.chair-swiper').length && typeof Swiper !== 'undefined') {

        var chairSwiper = new Swiper('.chair-swiper', {
            slidesPerView: 3,
            spaceBetween: 20,
            speed: 400,
            watchOverflow: true,
            navigation: {
                prevEl: '.chair-prev-btn',
                nextEl: '.chair-next-btn',
            },
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                576: {
                    slidesPerView: 2.5,
                    spaceBetween: 14,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                }
            }
        });

        // 의자 호버 및 클릭 시 왼쪽 메인 이미지 변경
        $('.chair-collection').on('mouseenter click', function () {
            var color = $(this).data('color');
            if (!color) return;

            // 의자 썸네일 활성화 표시
            $('.chair-collection').removeClass('active');
            $(this).addClass('active');

            // 왼쪽 메인 이미지 교체 (크로스페이드)
            var $targetImg = $('.collection-main-img[data-color="' + color + '"]');
            if ($targetImg.length) {
                $('.collection-main-img').removeClass('active');
                $targetImg.addClass('active');
            }
        });
    }


    // ====================================
    // Section 6 리뷰 슬라이더 (무중단 무한 연속 롤링 & 드래그 가속 모멘텀)
    // ====================================

    var $reviewSwiper = $('.review-swiper');
    var $reviewList = $('.review-list');
    var $initialCards = $reviewList.children('.review-card');

    if ($reviewSwiper.length && $reviewList.length && $initialCards.length > 0) {

        // 사용자가 작성한 원본 4개 카드를 DOM 상에서 3회 복제하여 총 16장(4세트)으로 구성
        // 어떤 해상도에서도 끊김 없이 연속 롤링을 유지하기 위한 충분한 슬라이드 버퍼
        $reviewList.append($initialCards.clone())
                   .append($initialCards.clone())
                   .append($initialCards.clone());

        var $allCards = $reviewList.children('.review-card');
        var originalCount = $initialCards.length; // 4
        var oneSetWidth = 0;

        function updateMetrics() {
            if ($allCards.length > originalCount) {
                // 정확히 1세트(4장)의 총 너비(카드 너비 + flex gap 포함)를 서브픽셀 단위로 측정
                oneSetWidth = $allCards[originalCount].offsetLeft - $allCards[0].offsetLeft;
            }
        }

        updateMetrics();
        $(window).on('load resize', updateMetrics);

        // 롤링 상태 변수
        var currentX = 0;
        var BASE_SPEED = -55; // 1초당 약 55px 왼쪽으로 연속 이동 (편안하고 부드러운 읽기 속도)
        var velocity = BASE_SPEED;
        var lastTimestamp = performance.now();

        // 드래그 상태 변수
        var isPointerDown = false;
        var isDragging = false;
        var dragStartX = 0;
        var dragCurrentX = 0;
        var prevPointerX = 0;
        var prevPointerTime = 0;
        var pointerVelocity = 0;
        var isHorizontalDrag = null;
        var touchStartY = 0;

        // 60fps / 120fps 하드웨어 가속 requestAnimationFrame 애니메이션 루프
        function animateMarquee(timestamp) {
            var dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
            lastTimestamp = timestamp;

            if (!isDragging) {
                // 드래그 후 튕겼을 때 빠른 속도에서 점진적으로 BASE_SPEED로 부드럽게 감속 복귀
                if (Math.abs(velocity - BASE_SPEED) > 1) {
                    velocity += (BASE_SPEED - velocity) * (1 - Math.exp(-3.5 * dt));
                } else {
                    velocity = BASE_SPEED;
                }

                currentX += velocity * dt;

                // 수학적 무한 루프: 1세트 너비만큼 이동 시 즉각 wrap (서브픽셀 오차나 끊김 없는 무지연 연속 이동)
                if (oneSetWidth > 0) {
                    while (currentX <= -oneSetWidth) {
                        currentX += oneSetWidth;
                    }
                    while (currentX > 0) {
                        currentX -= oneSetWidth;
                    }
                }

                $reviewList[0].style.transform = 'translate3d(' + currentX + 'px, 0, 0)';
            }

            requestAnimationFrame(animateMarquee);
        }

        requestAnimationFrame(animateMarquee);

        // 포인터 이벤트 (마우스 클릭 드래그 및 모바일 터치 스와이프)
        $reviewSwiper.on('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return; // 좌클릭만 허용

            isPointerDown = true;
            isDragging = true;
            dragStartX = e.clientX;
            dragCurrentX = currentX;
            prevPointerX = e.clientX;
            prevPointerTime = performance.now();
            pointerVelocity = 0;
            touchStartY = e.clientY;
            isHorizontalDrag = null;

            $reviewSwiper.addClass('is-dragging');

            if (e.pointerType === 'mouse') {
                e.preventDefault();
            }
        });

        $(window).on('pointermove', function (e) {
            if (!isPointerDown) return;

            var now = performance.now();

            // 모바일 터치 시 수직 스크롤과 수평 드래그 판별
            if (isHorizontalDrag === null) {
                var diffX = Math.abs(e.clientX - dragStartX);
                var diffY = Math.abs(e.clientY - touchStartY);
                if (diffX > 6 || diffY > 6) {
                    if (diffX >= diffY) {
                        isHorizontalDrag = true;
                    } else {
                        // 수직 스크롤일 경우 드래그 중단하여 브라우저의 기본 페이지 스크롤 허용
                        isHorizontalDrag = false;
                        isPointerDown = false;
                        isDragging = false;
                        $reviewSwiper.removeClass('is-dragging');
                        return;
                    }
                }
            }

            if (isHorizontalDrag === false) return;

            var deltaX = e.clientX - dragStartX;
            currentX = dragCurrentX + deltaX;

            // 드래그 중에도 무한 루프 wrap 유지
            if (oneSetWidth > 0) {
                while (currentX <= -oneSetWidth) {
                    currentX += oneSetWidth;
                    dragStartX += oneSetWidth;
                }
                while (currentX > 0) {
                    currentX -= oneSetWidth;
                    dragStartX -= oneSetWidth;
                }
            }

            $reviewList[0].style.transform = 'translate3d(' + currentX + 'px, 0, 0)';

            // 포인터 이동 속도 측정 (px/sec)
            var timeDelta = (now - prevPointerTime) / 1000;
            if (timeDelta > 0.008) {
                pointerVelocity = (e.clientX - prevPointerX) / timeDelta;
                prevPointerX = e.clientX;
                prevPointerTime = now;
            }
        });

        $(window).on('pointerup pointercancel', function () {
            if (!isPointerDown) return;

            isPointerDown = false;
            isDragging = false;
            $reviewSwiper.removeClass('is-dragging');

            // 사용자가 드래그로 휙 튕겼을 때(플릭) 관성 속도 부여
            if (Math.abs(pointerVelocity) > 60) {
                var boosted = pointerVelocity * 1.25;
                if (boosted > 3000) boosted = 3000;
                if (boosted < -3000) boosted = -3000;
                velocity = boosted;
            } else {
                velocity = BASE_SPEED;
            }
        });
    }


    // ====================================
    // FAQ — jQuery UI Accordion (부드러운 펼침)
    // ====================================
    if ($('#faq-accordion').length && $.fn.accordion) {
        $('#faq-accordion').accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content',
            animate: {
                easing: 'easeOutQuart',
                duration: 420
            },
            header: '> h3'
        });
    }

});
