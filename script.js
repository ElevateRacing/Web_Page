// Logo Shrinkage Script //
window.addEventListener('scroll', () => {
            const navbox = document.querySelector('.navbar');
            const logo2 = document.querySelector('.logo2');
            const logo1 = document.querySelector('.logo1');
            if (window.scrollY > 50) {
                logo2.classList.add('shrink');
                logo1.classList.add('shrink');
                navbox.classList.add('scrolled');
            } else {
                logo2.classList.remove('shrink');
                logo1.classList.remove('shrink');
                navbox.classList.remove('scrolled');
            }
        });

// Split Screen Slider Script //
document.addEventListener('DOMContentLoaded', function(){
            let wrapper = document.getElementById('page5');
            let topLayer = wrapper.querySelector('.buy');
            let handle = wrapper.querySelector('.handle');
            let delta = 0;

            function updateSlider(clientX) {
                        delta = (clientX - window.innerWidth / 2) *0.5;
                        handle.style.left = clientX + delta + 'px';
                        topLayer.style.width = clientX + delta + 'px';
            }

            // Mouse move handler
            wrapper.addEventListener('mounsemove', function(e) {
                        updateSlider(e.clientX);
            });

            // Touch move handler
            wrapper.addEventListener('touchmove', function(e) {
                        e.preventDefault();            //Prevent scrolling
                        let touch = e.touches[0];
                        updateSlider(touch.clientX);
            } { passive: false });
});
            
