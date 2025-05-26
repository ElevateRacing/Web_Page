window.addEventListener('scroll', () => {
            const navbox = document.querySelector('.navbar');
            const logo2 = document.querySelector('.logo2');
            if (window.scrollY > 50) {
                logo2.classList.add('shrink');
                navbox.classList.add('scrolled');
            } else {
                logo2.classList.remove('shrink');
                navbox.classList.remove('scrolled');
            }
        });
