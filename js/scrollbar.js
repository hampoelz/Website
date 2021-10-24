document.addEventListener("DOMContentLoaded", () => {
    OverlayScrollbars(document.querySelectorAll('body'), {
        className: "os-theme-thin-light",
        overflowBehavior: {
            x: "hidden"
        },
        scrollbars: {
            touchSupport: false
        }    
    });
});