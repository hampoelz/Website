document.addEventListener('DOMContentLoaded', () => {
    const constructionSection = document.getElementById('under-construction');
    const previewSection = document.getElementById('preview');

    previewSection.style.setProperty('display', 'none');

    console.log(document.body.clientWidth)

    window.addEventListener('resize', () => displayPreview());
    displayPreview();

    function displayPreview() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('debug') == 1 || (urlParams.get('preview') == 1 && document.documentElement.clientWidth > 1200 && document.documentElement.clientHeight > 700 && document.documentElement.clientWidth >= 1.5 * document.documentElement.clientHeight)) {
            constructionSection.style.setProperty('display', 'none');
            previewSection.style.removeProperty('display');
        } else {
            constructionSection.style.removeProperty('display');
            previewSection.style.setProperty('display', 'none');
        }
    }
});