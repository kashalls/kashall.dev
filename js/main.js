/*
* MALIN - Perfect Coming Soon Template
* Build Date: August 2015
* Author: Madeon08
* Copyright (C) 2015 Madeon08
* This is a premium product available exclusively here : http://themeforest.net/user/Madeon08/portfolio
*/

/*  TABLE OF CONTENTS
    ---------------------------
    1. Loading / Opening
    2. Fullscreen Div
    3. Loader fadeIn
    4. Scroll plugins
    5. Scroll to anchor
    6. Buttons / Menu interactions
    7. Countdown
    8. Newsletter
    9. Swipebox Gallery
   10. Map, Structure & Design
*/

/* ------------------------------------- */
/* 1. Loading / Opening ................ */
/* ------------------------------------- */

$(window).load(function() {

    setTimeout(function() {

        $(".loading-part").addClass("fadeOut");
        $("#home-part").removeClass("scale-max").addClass("scale-uni");
        $("#navigation").removeClass("").addClass("fadeInLeft");

    }, 2000);

    setTimeout(function() {
        $(".loading-part").addClass("display-none");
        $("#home-part").removeClass("scale-uni").addClass("");
    }, 3200);

});

$(document).ready(function(){

/* ------------------------------------- */
/* 2. Fullscreen Div ................... */
/* ------------------------------------- */

    function fullScreenContainer() {
    
        var screenWidth = $(window).width() + "px";
        var screenHeight = $(window).height() + "px";
        
        $("#home-part").css({
        width: screenWidth,
        height: screenHeight
        });

        $("#newsletter-part").css({
        width: screenWidth,
        height: screenHeight
        });

        $(".loader-part").css({
        width: screenWidth,
        height: screenHeight
        });
        
        $(window).resize( function () {
        
        var screenWidth = $(window).width() + "px";
        var screenHeight = $(window).height() + "px";
        
        $("#home-part").css({
        width: screenWidth,
        height: screenHeight
        }); 

        $("#newsletter-part").css({
        width: screenWidth,
        height: screenHeight
        });

        $(".loader-part").css({
        width: screenWidth,
        height: screenHeight
        });
        
        });
    
    }

    fullScreenContainer();

/* ------------------------------------- */
/* 3. Loader fadeIn .................... */
/* ------------------------------------- */

    setTimeout(function() {

        $(".loader-part").removeClass('opacity-0').addClass("fadeIn");

    }, 200);

/* ------------------------------------- */
/* 4. Scroll plugins ................... */
/* ------------------------------------- */

    $(function() {
        $('body').bind('mousewheel', function(event) {
          event.preventDefault();
          var scrollTop = this.scrollTop;
          this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
          //console.log(event.deltaY, event.deltaFactor, event.originalEvent.deltaMode, event.originalEvent.wheelDelta);
        });
    });


    function scrollbar(){
        $('body').mCustomScrollbar({
            scrollInertia: 150,
            axis            :"y"
        });    
    }

  scrollbar();

/* ------------------------------------- */
/* 5. Scroll to anchor ................. */
/* ------------------------------------- */

    $('a.about-content').click(function(){
        $("#mcs_container").mCustomScrollbar("scrollTo", "#main-about",{
            scrollInertia:500,
            callbacks:false
        });
    });

    $('a.services-content').click(function(){
        $("#mcs_container").mCustomScrollbar("scrollTo", "#services-content",{
            scrollInertia:500,
            callbacks:false
        });
    });

    $('a.contact-content').click(function(){
        $("#mcs_container").mCustomScrollbar("scrollTo", "#map",{
            scrollInertia:500,
            callbacks:false
        });
    });

/* ------------------------------------- */
/* 6. Buttons / Menu interactions ...... */
/* ------------------------------------- */

    $('.open-menu-mobile').click(function(){
            
        $('#navigation').toggleClass("translate-nav");
        $('.open-menu-mobile').toggleClass("translate-button");
        $('#home-part').toggleClass("opacity-03");
        $('#content-part').toggleClass("opacity-03");
        $('#newsletter-part').toggleClass("opacity-03");
        $(".opening-menu").toggleClass("display-none");
        $(".closing-menu").toggleClass("display-none");

    });

    $('ul.main-navigation a').click(function(){

        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");
        $('#home-part').removeClass("opacity-03");
        $('#content-part').removeClass("opacity-03");
        $('#newsletter-part').removeClass("opacity-03");
        $('#navigation').removeClass("translate-nav");
        $('.open-menu-mobile').removeClass("translate-button");

    });

    $('a.nav-link').click(function(){
        
        $(".open-menu-mobile").addClass("dark-button");

    });

    $('a.nav-link').click(function(){

        $('#content-part').removeClass("").addClass('right-content');

        $('.overlay').removeClass("").addClass('darky-overlay');

        $('#home-part').removeClass("").addClass('right-home');
        $('#home-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        $('#newsletter-part').removeClass("opacity-03").addClass('right-home');
        $('#newsletter-part .item-title').removeClass("fadeIn").addClass('fadeOut');
            
        $('.mCSB_scrollTools').removeClass("").addClass('mCSB_scrollTools-left');

        setTimeout(function() {

            $('#newsletter-part').removeClass("").addClass('opacity-0');
        
        }, 601);

    });

    $('a.open-content').click(function(){
        
        $('#content-part').removeClass("opacity-03").addClass('right-content');

        $('.overlay').removeClass("").addClass('darky-overlay');

        $('#home-part').removeClass("opacity-03").addClass('right-home');
        $('#home-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        $('#newsletter-part').removeClass("opacity-03").addClass('right-home newsletter-touch');
        $('#newsletter-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        $(".open-menu-mobile").addClass("dark-button").removeClass("translate-button");
            
        $('.mCSB_scrollTools').removeClass("").addClass('mCSB_scrollTools-left');

        $('#navigation').removeClass("translate-nav");
        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");

        setTimeout(function() {

            $('#newsletter-part').removeClass("").addClass('opacity-0');
        
        }, 601);

    });

    $('a.open-newsletter').click(function(){

        $('#content-part').removeClass("right-content opacity-03").addClass('');

        $('.overlay').removeClass("").addClass('darky-overlay');

        $('#home-part').removeClass("right-home opacity-03").addClass('');
        $('#home-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        $('#newsletter-part').removeClass("opacity-0 right-home newsletter-touch opacity-03").addClass('');
        $('#newsletter-part .item-title').removeClass("fadeOut").addClass('fadeIn');

        $('.mCSB_scrollTools').removeClass("mCSB_scrollTools-left").addClass('');

        $('#navigation').removeClass("translate-nav");
        $(".open-menu-mobile").removeClass("dark-button translate-button");
        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");

        setTimeout(function() {
            
            $("#mcs_container").mCustomScrollbar("scrollTo", "#main-about",{
                scrollInertia:500,
                callbacks:false
            });

        }, 601);

    });

    $('a.nav-link-close').click(function(){

        $('#content-part').removeClass("right-content opacity-03").addClass('');

        $('.overlay').removeClass("darky-overlay").addClass('');

        $('#home-part').removeClass("right-home opacity-03").addClass('');
        $('#home-part .item-title').removeClass("fadeOut").addClass('fadeIn');
        
        $('#newsletter-part').removeClass("opacity-03");
        $('#newsletter-part .item-title').removeClass("fadeIn").addClass('fadeOut');
        
        $('.mCSB_scrollTools').removeClass("mCSB_scrollTools-left").addClass('');

        $(".open-menu-mobile").removeClass("dark-button");

        setTimeout(function() {

            $('#newsletter-part').removeClass("right-home").addClass('opacity-0 newsletter-touch');

            $("#mcs_container").mCustomScrollbar("scrollTo", "#main-about",{
                scrollInertia:500,
                callbacks:false
            });

        }, 601);

    });

    // Esc key action / This part is used to close all the content and come back to home.
    // Commented because if you click ESC on your keyboard when you are viewing the gallery, the gallery is closed and you come back at the home.

    // $(document).keyup(function(e) {
    //     if (e.keyCode == 27) { // Esc
    //     $('#content-part').removeClass("right-content opacity-03").addClass('');

    //     $('.overlay').removeClass("darky-overlay").addClass('');

    //     $('#home-part').removeClass("right-home opacity-03").addClass('');
    //     $('#home-part .item-title').removeClass("fadeOut").addClass('fadeIn');
        
    //     $('#newsletter-part').removeClass("opacity-03");
    //     $('#newsletter-part .item-title').removeClass("fadeIn").addClass('fadeOut');
        
    //     $('.mCSB_scrollTools').removeClass("mCSB_scrollTools-left").addClass('');

    //     $(".open-menu-mobile").removeClass("dark-button");

    //     setTimeout(function() {

    //         $('#newsletter-part').removeClass("right-home").addClass('opacity-0 newsletter-touch');

    //         $("#mcs_container").mCustomScrollbar("scrollTo", "#main-about",{
    //             scrollInertia:500
    //         });

    //     }, 601);
        
    // });

/* ------------------------------------- */
/* 7. Countdown ........................ */
/* ------------------------------------- */

    // Set you end date just below
    $('#countdown_dashboard').countDown({
        targetDate: {
            'day': 31,
            'month': 12,
            'year': 2016,
            'hour': 11,
            'min': 13,
            'sec': 0
        },
        omitWeeks: true
    });

/* ------------------------------------- */
/* 8. Newsletter ........................ */
/* ------------------------------------- */

    $("#notifyMe").notifyMe();

/* ------------------------------------- */
/* 9. Swipebox Gallery ................. */
/* ------------------------------------- */

    $('.swipebox').swipebox();

    /* Video */
    $('.swipebox-video').swipebox();


/* ------------------------------------- */
/* 10. Map, Structure & Design ......... */
/* ------------------------------------- */

// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
google.maps.event.addDomListener(window, 'resize', init);

function init() {

    // Basic options for a simple Google Map
    // The latitude and longitude to center the map (always required)
    var center = new google.maps.LatLng(40.70820, -74.00487);
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 11,
        scrollwheel: false,
        draggable: false,
        center: center,
        streetViewControl: true,
        mapTypeControl: true,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            },
            {
                "lightness": "65"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "gamma": "4.75"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    }
]
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions, center);

    var locations = [
        ['<h6>Bondi Beach, East Coast</h6><p>This is where we are currently, the sun is up...<br><i class="fa fa-coffee"></i> Visit us, we pay the coffee!</p>', 40.70820, -74.00487, 4],
        // ['<h6>Coogee Beach, East Coast</h6><p>Opening Hours<br><i class="fa fa-clock-o"></i> 8:00 to 22:00</p>', 40.66810, -73.94480, 5],
        // ['<h6>Cronulla Beach, East Coast</h6><p>Opening Hours<br><i class="fa fa-clock-o"></i> 10:00 to 20:00</p>', 40.80427, -74.01208, 3],
        // ['<h6>Manly Beach, East Coast</h6><p>Opening Hours<br><i class="fa fa-clock-o"></i> 6:00 to 14:00</p>', 40.76759, -73.96756, 2],
        // ['<h6>Maroubra Beach, East Coast</h6><p>Opening Hours<br><i class="fa fa-clock-o"></i> 12:00 to 23:30</p>', 40.66429, -74.11469, 1]
    ];

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

});