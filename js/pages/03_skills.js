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

    let pastOffset = 0;

    const timelineYears = timeline.querySelectorAll("section.year");
    for (let j = 0; j < timelineYears.length; j++) {
      const section = timelineYears[j];
      
      const timelineFuture = section.querySelectorAll("section.future");
      if (timelineFuture.length <= 0) pastOffset += section.offsetHeight + parseInt(getComputedStyle(section).marginBottom);
      else {
        const timelinePast = section.querySelectorAll("section");
        for (let k = 0; k < timelinePast.length; k++) {
          const pastSection = timelinePast[k];

          if (pastSection == timelineFuture[0]) break;

          if (k == 0) {
            const header = section.querySelector("h3");

            const headerTop = header.getBoundingClientRect().top;
            const sectionTop = pastSection.getBoundingClientRect().top;
            
            pastOffset += sectionTop - headerTop;
          }

          pastOffset += pastSection.offsetHeight + parseInt(getComputedStyle(pastSection).marginBottom);;
        }

        break;
      }
    }

    const pixelPercent = (1 / timeline.offsetHeight) * 100;
    const futureTransPercent = pixelPercent * pastOffset;
    const futureTransPercentVar = `--timeline${i + 1}-futureTransPercent`

    document.documentElement.style.setProperty(futureTransPercentVar, "0%");

    gsap.timeline({
      scrollTrigger: {
        trigger: `#skills .timeline:nth-of-type(${i + 1})`,
        start: "top bottom",
        end: "bottom-=30%",
        scrub: 1
      }
    })
      .fromTo(document.documentElement,
        { [futureTransPercentVar]: 0 },
        { [futureTransPercentVar]: futureTransPercent });

    const timelineStyle = document.head.appendChild(document.createElement("style"));
    timelineStyle.innerHTML = `#skills .timeline:nth-of-type(${i + 1}):after { background: linear-gradient(180deg, rgb(var(--timeline-accent-rgb)) 0%, rgb(var(--timeline-accent-rgb)) calc(var(${futureTransPercentVar}) - ${20*pixelPercent}%), rgba(var(--foreground-rgb), 0.1) calc(var(${futureTransPercentVar}) - ${8*pixelPercent}%), rgba(var(--foreground-rgb), 0.1) 100%) !important; }`;
  }

  let changeMouseColor = gsap
    .timeline({
      paused: true,
      invalidateOnRefresh: true
    })
    .to(document.documentElement, {
      "--cursor-color": () => `rgb(${getCssVariable('--accent-2-rgb')})`
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
