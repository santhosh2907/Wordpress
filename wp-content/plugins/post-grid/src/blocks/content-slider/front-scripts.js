document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        classes: {
            arrows: 'splide__arrows',
            arrow: 'splide__arrow',
            prev: 'splide__arrow--prev',
            next: 'splide__arrow--next',
        },
    });
    splide.mount();
});