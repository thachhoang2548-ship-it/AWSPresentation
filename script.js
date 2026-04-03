document.addEventListener("DOMContentLoaded", () => {
    // Add page loaded class after a tiny delay for transitions to apply correctly
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 10);
});

function navigateTo(url) {
    document.body.classList.remove('page-loaded');
    document.body.classList.add('page-exiting');
    setTimeout(() => {
        window.location.href = url;
    }, 400); // 400ms match the CSS transition duration
}

document.addEventListener('keydown', function (event) {
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    let currentIndex = 1;
    if (currentPath.startsWith('slide-')) {
        let match = currentPath.match(/slide-(\d+).html/);
        if (match) currentIndex = parseInt(match[1], 10);
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
        let next = currentIndex + 1;
        if (next <= 12) navigateTo("slide-" + next + ".html");
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
        let prev = currentIndex - 1;
        if (prev === 1) navigateTo("index.html");
        else if (prev > 1) navigateTo("slide-" + prev + ".html");
    }
});

// Update click events on pills/links to allow smooth exit animations
document.addEventListener('click', function (event) {
    let anchor = event.target.closest('a');
    if (anchor) {
        let href = anchor.getAttribute('href');
        // If it's a hash link pointing to a slide (e.g. #slide-2)
        if (href && href.startsWith('#slide-')) {
            event.preventDefault();
            let targetSlide = href.replace('#slide-', '');
            let targetUrl = targetSlide === '1' ? 'index.html' : 'slide-' + targetSlide + '.html';
            navigateTo(targetUrl);
        } else if (href && href.includes('.html') && !href.startsWith('http')) {
            // Local HTML links
            if (!anchor.hasAttribute('target') || anchor.target !== '_blank') {
                event.preventDefault();
                navigateTo(href);
            }
        }
    }
});
