document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const constructionSection = document.getElementById('under-construction');
    const previewSection = document.getElementById('preview');

    previewSection.style.setProperty('display', 'none');

    console.log(document.body.clientWidth)

    if (urlParams.get('debug') == 1 || (urlParams.get('preview') == 1 && document.body.clientWidth > 1200 && document.body.clientHeight > 700 && document.body.clientWidth >= 1.5 * document.body.clientHeight)) {
        constructionSection.style.setProperty('display', 'none');
        previewSection.style.removeProperty('display');
    }
});