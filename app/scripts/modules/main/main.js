/*global define*/
/*global Reveal*/
/*global hljs*/
/**
 * Main module. Initializes slides, adds socket message listeners.
 * @module main
 * @return {Object} Module itself
 */
define('modules/main', function () {
    'use strict';

    /**
     * Module class
     * @class Main
     */
    var Main = function () {};

    /**
     * Init method, invoked upon application start
     * @function Main#init
     * @public
     */
    Main.prototype.init = function () {
        var me = this;

        me.on('socketMessage', me._onSocketMessage, me);
        me._startRevealJs();
    };

    /**
     * Socket message handler
     * @function Main#_onSocketMessage
     * @private
     * @param {object} message Socket message object
     * @todo implement handler factory
     */
    Main.prototype._onSocketMessage = function(message){
        switch(message.data){
        case 'goRight':
            Reveal.next();
            break;
        case 'goLeft':
            Reveal.prev();
            break;
        default:
            break;
        }
    };

    /**
     * Starts RevealJS application.
     * Config taken from reveal.js docs
     * @link https://github.com/hakimel/reveal.js/
     * @function Main#_startRevealJs
     * @private
     */
    Main.prototype._startRevealJs = function(){
        Reveal.initialize({

            // Display controls in the bottom right corner
            controls: true,

            // Display a presentation progress bar
            progress: false,

            // Display the page number of the current slide
            slideNumber: false,

            // Push each slide change to the browser history
            history: false,

            // Enable keyboard shortcuts for navigation
            keyboard: true,

            // Enable the slide overview mode
            overview: true,

            // Vertical centering of slides
            center: true,

            // Enables touch navigation on devices with touch input
            touch: true,

            // Loop the presentation
            loop: false,

            // Change the presentation direction to be RTL
            rtl: false,

            // Turns fragments on and off globally
            fragments: true,

            // Flags if the presentation is running in an embedded mode,
            // i.e. contained within a limited portion of the screen
            embedded: false,

            // Number of milliseconds between automatically proceeding to the
            // next slide, disabled when set to 0, this value can be overwritten
            // by using a data-autoslide attribute on your slides
            autoSlide: 0,

            // Stop auto-sliding after user input
            autoSlideStoppable: true,

            // Enable slide navigation via mouse wheel
            mouseWheel: false,

            // Hides the address bar on mobile devices
            hideAddressBar: true,

            // Opens links in an iframe preview overlay
            previewLinks: false,

            // Transition style
            transition: 'fade', // default/cube/page/concave/zoom/linear/fade/none

            // Transition speed
            transitionSpeed: 'default', // default/fast/slow

            // Transition style for full page slide backgrounds
            backgroundTransition: 'default', // default/none/slide/concave/convex/zoom

            // Number of slides away from the current that are visible
            viewDistance: 3,

            // Parallax background image
            parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

            // Parallax background size
            parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

            dependencies: [
                { src: 'bower_components/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
                { src: 'bower_components/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: 'bower_components/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                { src: 'bower_components/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
                { src: 'bower_components/reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
                { src: 'bower_components/reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
            ]
        });
    };

    return Main;
});