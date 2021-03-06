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

    let offset = 0;
    let pastOffset = 0;
    
    let pointPositions = [];

    const timelineYears = timeline.querySelectorAll("section.year");

    for (let j = 0; j < timelineYears.length; j++) {
      const yearSection = timelineYears[j];

      let sectionOffset = 0;

      const timelineSections = yearSection.querySelectorAll("section");
      const timelineFutureSections = yearSection.querySelectorAll("section.future:not(.pseudo-future)");
      
      for (let k = 0; k < timelineSections.length; k++) {
        const section = timelineSections[k];

        const isFirstSection = k == 0;
        const isLastSection = k == timelineSections.length - 1;

        const isFutureSection = Array.from(timelineFutureSections).includes(section);
        const isFirstFutureSection = timelineFutureSections[0] == section;

        pointPositions.push({ element: section, offset: offset + sectionOffset});

        if (!isFutureSection) {
          section.classList.add("future", "pseudo-future");
        }

        if (isFirstFutureSection) {
          pastOffset = offset + sectionOffset;
        }

        if (isFirstSection) {
          const yearSectionHeader = yearSection.querySelector("h3");

          const dataScrollTarget = document.createAttribute("data-scroll-target");
          dataScrollTarget.value = `#skills .timeline:nth-of-type(${i + 1}) section.year:nth-child(${j + 1})`;

          yearSectionHeader.setAttributeNode(createDataScrollAttr());
          yearSectionHeader.setAttributeNode(createDataScrollStickyAttr());
          yearSectionHeader.setAttributeNode(createDataScrollOffsetAttr());
          yearSectionHeader.setAttributeNode(dataScrollTarget);

          const headerTop = yearSectionHeader.getBoundingClientRect().top;
          const sectionTop = section.getBoundingClientRect().top;
          sectionOffset += sectionTop - headerTop;
        }

        sectionOffset += section.offsetHeight + parseFloat(getComputedStyle(section).marginBottom);

        if (isLastSection) {
          sectionOffset += (yearSection.offsetHeight + parseFloat(getComputedStyle(yearSection).marginBottom) - sectionOffset)
        }
      }

      offset += sectionOffset;
    }

    const pixelPercent = (1 / timeline.offsetHeight) * 100;
    const futureTransPercent = pixelPercent * pastOffset;
    const futureTransPercentVar = `--timeline${i + 1}-futureTransPercent`

    pointPositions = pointPositions.map(point => { return { element: point.element, offset: pixelPercent * point.offset + 20 * pixelPercent } });
    document.documentElement.style.setProperty(futureTransPercentVar, "0%");

    gsap.timeline({
      scrollTrigger: {
        trigger: `#skills .timeline:nth-of-type(${i + 1})`,
        start: "top bottom",
        end: "bottom-=30%",
        scrub: 1,
        onUpdate: trigger => {
          const futureTransPercent = document.documentElement.style.getPropertyValue(futureTransPercentVar);

          if (trigger.direction == 1) {
            const filteredPoints = pointPositions.filter(position => parseFloat(position.offset) <= parseFloat(futureTransPercent));

            for (let j = 0; j < filteredPoints.length; j++) {
              const point = filteredPoints[j];
              if (trigger.direction == 1 && point.isPast) continue;
  
              const section = point.element;
              section.classList.remove("future", "pseudo-future");
              pointPositions[pointPositions.indexOf(point)].isPast = true;
            }
          }

          if (trigger.direction == -1) {
            const filteredPoints = pointPositions.filter(position => parseFloat(position.offset) >= parseFloat(futureTransPercent));

            for (let j = 0; j < filteredPoints.length; j++) {
              const point = filteredPoints[j];
              if (trigger.direction == -1 && !point.isPast) continue;
  
              const section = point.element;
              section.classList.add("future", "pseudo-future");
              pointPositions[pointPositions.indexOf(point)].isPast = false;
            }
          }
        },
      }
    })
      .fromTo(document.documentElement,
        { [futureTransPercentVar]: 0 },
        { [futureTransPercentVar]: futureTransPercent });

    const timelineStyle = document.head.appendChild(document.createElement("style"));
    timelineStyle.innerHTML = `#skills .timeline:nth-of-type(${i + 1}):after { background: linear-gradient(180deg, rgb(var(--timeline-accent-rgb)) 0%, rgb(var(--timeline-accent-rgb)) calc(var(${futureTransPercentVar}) - ${20 * pixelPercent}%), rgba(var(--foreground-rgb), 0.1) calc(var(${futureTransPercentVar}) - ${8 * pixelPercent}%), rgba(var(--foreground-rgb), 0.1) 100%) !important; }`;
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
