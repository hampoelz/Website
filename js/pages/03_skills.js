document.addEventListener("DOMContentLoaded", () => {
    const createDataScrollAttr = () => document.createAttribute("data-scroll");
    const createDataScrollStickyAttr = () => document.createAttribute("data-scroll-sticky");
    const createDataScrollOffsetAttr = () => {
        let dataScrollOffset = document.createAttribute("data-scroll-offset");
        dataScrollOffset.value = "-10%, 5%";
        return dataScrollOffset;
    };

    const timelines = document.querySelectorAll("#skills .timeline");
    for (let i = 0; i < timelines.length; i++) {
        const timeline = timelines[i];
        const timelineHeaders = timeline.querySelectorAll("section.year h3");
        for (let j = 0; j < timelineHeaders.length; j++) {
            const dataScrollTarget = document.createAttribute("data-scroll-target");
            dataScrollTarget.value = `#skills .timeline:nth-of-type(${i + 1}) section.year:nth-child(${j + 1})`;

            const header = timelineHeaders[j];
            header.setAttributeNode(createDataScrollAttr());
            header.setAttributeNode(createDataScrollStickyAttr());
            header.setAttributeNode(createDataScrollOffsetAttr());
            header.setAttributeNode(dataScrollTarget);
        }
    }

    let changeMouseColor = gsap
      .timeline({
        paused: true,
      })
      .to(document.body, {
        "--cursor-color": "#d32829",
      });

    document
      .querySelector(".spacer.skills")
      .addEventListener("mouseover", () => changeMouseColor.play());
    document
      .querySelector("#skills")
      .addEventListener("mouseover", () => changeMouseColor.play());
    document
      .querySelector(".spacer.skills")
      .addEventListener("mouseleave", () => changeMouseColor.reverse());
    document
      .querySelector("#skills")
      .addEventListener("mouseleave", () => changeMouseColor.reverse());
});
