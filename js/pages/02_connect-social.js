document.addEventListener('DOMContentLoaded', () => {
    const socialContainer = document.querySelectorAll("#connect-social .container");

    new MouseParallax([socialContainer], { multiplier: 0.001 });
});