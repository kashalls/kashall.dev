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

        $('#newsletter-part').removeClass("opacity-03").addClass('');

    });

    $('a.open-content').click(function(){
        
        $('#content-part').removeClass("opacity-03").addClass('');

        $('#home-part').removeClass("opacity-03").addClass('');

        $('#navigation').removeClass("translate-nav");
        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");

    });

    $('a.open-newsletter').click(function(){

        $('#content-part').removeClass("opacity-03").addClass('');

        $('.overlay').removeClass("").addClass('darky-overlay');

        $('#home-part').removeClass("opacity-03").addClass('');
        $('#home-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        $('#newsletter-part').removeClass("opacity-0 right-home newsletter-touch opacity-03").addClass('');
        $('#newsletter-part .item-title').removeClass("fadeOut").addClass('fadeIn');

        $('#navigation').removeClass("translate-nav");
        $(".open-menu-mobile").removeClass("dark-button translate-button");
        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");

    });

    $('a.nav-link-close').click(function(){

        $('#content-part').removeClass("opacity-03").addClass('');

        $('.overlay').removeClass("darky-overlay").addClass('');

        $('#home-part').removeClass("opacity-03").addClass('');
        $('#home-part .item-title').removeClass("fadeOut").addClass('fadeIn');
        
        $('#newsletter-part').removeClass("opacity-03");
        $('#newsletter-part .item-title').removeClass("fadeIn").addClass('fadeOut');

        setTimeout(function() {

            $('#newsletter-part').removeClass("").addClass('opacity-0 newsletter-touch');

        }, 601);

    });

    $('html').click(function() {
        $(".opening-menu").removeClass("display-none");
        $(".closing-menu").addClass("display-none");
        $('#home-part').removeClass("opacity-03");
        $('#content-part').removeClass("opacity-03");
        $('#newsletter-part').removeClass("opacity-03");
        $('#navigation').removeClass("translate-nav");
        $('.open-menu-mobile').removeClass("translate-button");
    });

    $('#navigation').click(function(event){
        event.stopPropagation();
    });

    $('.open-menu-mobile').click(function(event){
        event.stopPropagation();
    });

});
