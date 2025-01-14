document.addEventListener('DOMContentLoaded', function () {
    const aboutButton = document.getElementById('about-button');
    const posterButton = document.getElementById('poster-button');
    const adsButton = document.getElementById('ads-button');

    // Event listener for About button
    aboutButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the about page
        window.location.href = aboutButton.href;
    });

    // Event listener for Poster button
    posterButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the poster page
        window.location.href = posterButton.href;
    });

    // Event listener for Ads button
    adsButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        // Redirect to the ads page
        window.location.href = adsButton.href;
    });
});