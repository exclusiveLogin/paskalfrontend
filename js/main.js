$(document).ready(function(){
    var slidesWrapper = $('.cd-hero-slider');

    //check if a .cd-hero-slider exists in the DOM
    if ( slidesWrapper.length > 0 ) {
        var primaryNav = $('.cd-primary-nav'),
            sliderNav = $('.cd-slider-nav'),
            navigationMarker = $('.cd-marker'),
            slidesNumber = slidesWrapper.children('li').length,
            visibleSlidePosition = 0,
            autoPlayId,
            autoPlayDelay = 7000;

        //upload videos (if not on mobile devices)
        uploadVideo(slidesWrapper);

        //autoplay slider
        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

        //on mobile - open/close primary navigation clicking/tapping the menu icon
        primaryNav.on('click', function(event){
            if($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
        });

        //change visible slide
        sliderNav.on('click', 'li', function(event){
            event.preventDefault();
            var selectedItem = $(this);
            if(!selectedItem.hasClass('selected')) {
                // if it's not already selected
                var selectedPosition = selectedItem.index(),
                    activePosition = slidesWrapper.find('li.selected').index();

                if( activePosition < selectedPosition) {
                    nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
                } else {
                    prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
                }

                //this is used for the autoplay
                visibleSlidePosition = selectedPosition;

                updateSliderNavigation(sliderNav, selectedPosition);
                updateNavigationMarker(navigationMarker, selectedPosition+1);
                //reset autoplay
                setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
            }
        });
    }

    function nextSlide(visibleSlide, container, pagination, n){
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
        checkVideo(visibleSlide, container, n);
    }

    function prevSlide(visibleSlide, container, pagination, n){
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
        checkVideo(visibleSlide, container, n);
    }

    function updateSliderNavigation(pagination, n) {
        var navigationDot = pagination.find('.selected');
        navigationDot.removeClass('selected');
        pagination.find('li').eq(n).addClass('selected');
    }

    function setAutoplay(wrapper, length, delay) {
        if(wrapper.hasClass('autoplay')) {
            clearInterval(autoPlayId);
            autoPlayId = window.setInterval(function(){autoplaySlider(length)}, delay);
        }
    }

    function autoplaySlider(length) {
        if( visibleSlidePosition < length - 1) {
            nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, visibleSlidePosition + 1);
            visibleSlidePosition +=1;
        } else {
            prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, 0);
            visibleSlidePosition = 0;
        }
        updateNavigationMarker(navigationMarker, visibleSlidePosition+1);
        updateSliderNavigation(sliderNav, visibleSlidePosition);
    }

    function uploadVideo(container) {
        container.find('.cd-bg-video-wrapper').each(function(){
            var videoWrapper = $(this);
            if( videoWrapper.is(':visible') ) {
                // if visible - we are not on a mobile device
                var	videoUrl = videoWrapper.data('video'),
                    video = $('<video loop><source src="'+videoUrl+'.mp4" type="video/mp4" /><source src="'+videoUrl+'.webm" type="video/webm" /></video>');
                video.appendTo(videoWrapper);
                // play video if first slide
                if(videoWrapper.parent('.cd-bg-video.selected').length > 0) video.get(0).play();
            }
        });
    }

    function checkVideo(hiddenSlide, container, n) {
        //check if a video outside the viewport is playing - if yes, pause it
        var hiddenVideo = hiddenSlide.find('video');
        if( hiddenVideo.length > 0 ) hiddenVideo.get(0).pause();

        //check if the select slide contains a video element - if yes, play the video
        var visibleVideo = container.children('li').eq(n).find('video');
        if( visibleVideo.length > 0 ) visibleVideo.get(0).play();
    }

    function updateNavigationMarker(marker, n) {
        marker.removeClassPrefix('item').addClass('item-'+n);
    }

    $.fn.removeClassPrefix = function(prefix) {
        //remove all classes starting with 'prefix'
        this.each(function(i, el) {
            var classes = el.className.split(" ").filter(function(c) {
                return c.lastIndexOf(prefix, 0) !== 0;
            });
            el.className = $.trim(classes.join(" "));
        });
        return this;
    };

    $('#btn_map').click(function () {
        toggleMap();
    });
    function toggleMap(){
        if($('#brand_map').hasClass('hidden')){
            $('#brand_map').removeClass('hidden');
            $('#btn_map').addClass('map_active');
            var destination = $('#contact').offset().top;
            $('html body').animate({scrollTop:destination},1000);
        }
        else{
            $('#brand_map').addClass('hidden');
            $('#btn_map').removeClass('map_active');
        }
    }
    $('#contact_link,a[href="/contact"]').click(function(event){
        event.preventDefault();
        var destination = $("#contact").offset().top;
        $('html body').animate({scrollTop:destination},500,function(){
            var oldcolor = $("#contact").css('backgroundColor');
            $("#contact").animate({backgroundColor:'#FFF5A8'},500,function(){
                $(this).animate({backgroundColor:oldcolor},3000);
            });
        });
    });
    $('#arrow_down').click(function(event){
        var destination = $("#archivement").offset().top;
        $('html body').animate({scrollTop:destination},500,function(){
            var oldcolor = $("#archivement").css('backgroundColor');
            $("#archivement").animate({backgroundColor:'#FFF5A8'},500,function(){
                $(this).animate({backgroundColor:oldcolor},3000);
            });
        });
    });

    $('.scroll-reveal').each(function () {
        $(this).attr("data-sr","flip 45deg ease 0.5s");
    });

    $('#library .docheadertext').click(function () {
        $(this).find('i').toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
        var parent = $(this).parents('.row');
        parent.find('.doc_subcat').toggle(500);
    });
    $('#close_lib, #zanaves').click(function(){
        close_lib();
    });
    $('#doc_link').click(function (event) {
        event.preventDefault();
        open_lib();
    });
    function close_lib(){
        $('#library').animate({'right':'-370px','opacity':0.5},600);
        $('#zanaves').animate({'opacity':0.0},600, function () {
            $(this).hide();
        });
    }
    function open_lib(){
        $('#library').animate({'right':'0px','opacity':1.0},600);
        $('#zanaves').show().animate({'opacity':0.7},600);
    }

    window.sr = new scrollReveal({
        mobile:true,
        vFactor:0.05,
        reset:true
    });
});