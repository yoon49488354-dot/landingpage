$(function () {

    const crafted = document.querySelector(".crafted");
    const lines = document.querySelectorAll(".point-line");

    if (!crafted || lines.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                lines.forEach(function (line, index) {

                    setTimeout(function () {
                        line.classList.add("show");
                    }, 1500 + index * 300);

                });

                observer.unobserve(crafted);
            }

        });

    }, {
        threshold: 0.3
    });

    observer.observe(crafted);

});