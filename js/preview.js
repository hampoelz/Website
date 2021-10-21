document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const constructionSection = document.getElementById('under-construction');
    const previewSection = document.getElementById('preview');

    previewSection.style.setProperty('display', 'none');

    if (urlParams.get('preview') == 1) {
        constructionSection.style.setProperty('display', 'none');
        previewSection.style.removeProperty('display');
    }
});