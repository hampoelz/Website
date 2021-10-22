document.addEventListener("DOMContentLoaded", () => {
    OverlayScrollbars(document.querySelectorAll('body'), {
        className: "os-theme-thin-light",
        scrollbars: {
            touchSupport: false
        }    
    });
});