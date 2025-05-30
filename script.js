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
            let skew = 0;
            let delta = 0;

            if(wrapper.className.indexOf('section-page5') != -1) {
                        skew = 1000;
            }

            wrapper.addEventListener('mousemove', function(e) {
                        delta = (e.clientX - window.innerWidth / 2) * 0.5;

                        handle.style.left = e.clientX + delta + 'px';
            });
});
            
