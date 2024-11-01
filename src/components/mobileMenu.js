export const initializeMobileMenu = () => {
    const logoImg = document.getElementById('logo-img');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    const handleLogoClick = () => {
        window.location.reload();
    };

    const toggleMobileMenu = (event) => {
        mobileNav.classList.toggle('show');
        event.stopPropagation();
    };

    const closeMobileMenu = (event) => {
        const isClickInsideMenu = mobileNav.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInsideMenu && mobileNav.classList.contains('show')) {
            mobileNav.classList.remove('show');
        }
    };

    logoImg.addEventListener('click', handleLogoClick);
    menuToggle.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', closeMobileMenu);

    // Return a cleanup function
    return () => {
        logoImg.removeEventListener('click', handleLogoClick);
        menuToggle.removeEventListener('click', toggleMobileMenu);
        document.removeEventListener('click', closeMobileMenu);
    };
};