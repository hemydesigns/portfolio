/*!

=========================================================
* Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

"use strict";
$(document).ready(function() {

    // Collapse navigation
    $('.navbar-main .collapse').on('hide.bs.collapse', function() {
        var $this = $(this);
        $this.addClass('collapsing-out');
    });

    $('.navbar-main .collapse').on('hidden.bs.collapse', function() {
        var $this = $(this);
        $this.removeClass('collapsing-out');
    });

    $('.navbar-main .dropdown').on('hide.bs.dropdown', function() {
        var $this = $(this).find('.dropdown-menu');

        $this.addClass('close');

        setTimeout(function() {
            $this.removeClass('close');
        }, 200);

    });

    // Headroom - show/hide navbar on scroll
    if ($('.headroom')[0]) {
        var headroom = new Headroom(document.querySelector("#navbar-main"), {
            offset: 300,
            tolerance: {
                up: 30,
                down: 30
            },
        });
        headroom.init();
    }

    // Datepicker
    $('.datepicker')[0] && $('.datepicker').each(function() {
        $('.datepicker').datepicker({
            disableTouchKeyboard: true,
            autoclose: false
        });
    });

    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Popover
    $('[data-toggle="popover"]').each(function() {
        var popoverClass = '';
        if ($(this).data('color')) {
            popoverClass = 'popover-' + $(this).data('color');
        }
        $(this).popover({
            trigger: 'focus',
            template: '<div class="popover ' + popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        })
    });

    // Additional .focus class on form-groups
    $('.form-control').on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    // NoUI Slider
    if ($(".input-slider-container")[0]) {
        $('.input-slider-container').each(function() {

            var slider = $(this).find('.input-slider');
            var sliderId = slider.attr('id');
            var minValue = slider.data('range-value-min');
            var maxValue = slider.data('range-value-max');

            var sliderValue = $(this).find('.range-slider-value');
            var sliderValueId = sliderValue.attr('id');
            var startValue = sliderValue.data('range-value-low');

            var c = document.getElementById(sliderId),
                d = document.getElementById(sliderValueId);

            noUiSlider.create(c, {
                start: [parseInt(startValue)],
                connect: [true, false],
                //step: 1000,
                range: {
                    'min': [parseInt(minValue)],
                    'max': [parseInt(maxValue)]
                }
            });

            c.noUiSlider.on('update', function(a, b) {
                d.textContent = a[b];
            });
        })
    }

    if ($("#input-slider-range")[0]) {
        var c = document.getElementById("input-slider-range"),
            d = document.getElementById("input-slider-range-value-low"),
            e = document.getElementById("input-slider-range-value-high"),
            f = [d, e];

        noUiSlider.create(c, {
            start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
            connect: !0,
            range: {
                min: parseInt(c.getAttribute('data-range-value-min')),
                max: parseInt(c.getAttribute('data-range-value-max'))
            }
        }), c.noUiSlider.on("update", function(a, b) {
            f[b].textContent = a[b]
        })
    }


    // When in viewport
    $('[data-toggle="on-screen"]')[0] && $('[data-toggle="on-screen"]').onScreen({
        container: window,
        direction: 'vertical',
        doIn: function() {
            //alert();
        },
        doOut: function() {
            // Do something to the matched elements as they get off scren
        },
        tolerance: 200,
        throttle: 50,
        toggleClass: 'on-screen',
        debug: false
    });

    // Scroll to anchor with scroll animation
    $('[data-toggle="scroll"]').on('click', function(event) {
        var hash = $(this).attr('href');
        var offset = $(this).data('offset') ? $(this).data('offset') : 0;

        // Animate scroll to the selected section
        $('html, body').stop(true, true).animate({
            scrollTop: $(hash).offset().top - offset
        }, 600);

        event.preventDefault();
    });

});


//cursor
class SlinkyCursor {
    constructor(settings) {
        const defaults = {
            size: 31,
            laziness: 5,
            stiffness: 2.5
        };

        this.settings = Object.assign(defaults, settings);
        this.mouse = { x: 0, y: 0 };
        this.deltaPos = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this._animate = this._animate.bind(this);
    }

    init() {
        this._createPest();
        this._addEventListener();
        this._animate();
    }

    _createPest() {
        this.pest = document.createElement("span");
        this.pest.id = "pest";
        this.pest.style.height = `${this.settings.size}px`;
        document.body.appendChild(this.pest);
    }

    _addEventListener() {
        window.addEventListener("mousemove", e => {
            const { pageX: x, pageY: y } = e;
            this.mouse = { x, y };
        });
    }

    _animate() {
        const { x: xMouse, y: yMouse } = this.mouse;
        const { x: xPos, y: yPos } = this.pos;
        const { x: xDelta, y: yDelta } = this.deltaPos;
        const { laziness, stiffness, size } = this.settings;
        this.deltaPos = { x: xMouse - xPos, y: yMouse - yPos };

        this.pos = { x: xPos + xDelta / laziness, y: yPos + yDelta / laziness };

        this.pest.style.cssText += `top: ${this.pos.y - size / 2}px; left: ${
    this.pos.x - size / 2
    }px;`;

        // Slinky

        const angleDeg =
            Math.atan2(yMouse - this.pos.y, xMouse - this.pos.x) * 180 / Math.PI;

        const stretchWidth =
            size +
            this._diff(this.pos.x, this.pos.y, this.mouse.x, this.mouse.y) /
            stiffness;
        this.pest.style.cssText += `width: ${stretchWidth}px`;
        // Angle slinky
        this.pest.style.cssText += `transform: rotate(${angleDeg}deg)`;

        requestAnimationFrame(this._animate);
    }

    _diff(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }
}

// Smooth Scroll to Links

const slinky = new SlinkyCursor();
slinky.init();

$(document).ready(function() {
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 2000, function() {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

// Clarity
(function(c, l, a, r, i, t, y) {
    c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments)
    };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "a92mc1tv7r");