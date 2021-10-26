document.addEventListener("DOMContentLoaded", () => {
    OverlayScrollbars(document.querySelectorAll('body'), {
        className: "os-theme-thin",
        overflowBehavior: {
            x: "hidden"
        },
        scrollbars: {
            touchSupport: false
        }    
    });
});