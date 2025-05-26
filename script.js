window.addEventListener('scroll', () => {
            const navbox = document.querySelector('.navbar');
            const logo = document.querySelector('.logo');
            if (window.scrollY > 50) {
                logo.classList.add('shrink');
                navbox.classList.add('scrolled');
            } else {
                logo.classList.remove('shrink');
                navbox.classList.remove('scrolled');
            }
        });
