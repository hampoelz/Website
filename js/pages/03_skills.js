// TODO: separate timeline code to it's own class
class Timeline extends HTMLElement {
  constructor() {
    super()
  }
}

customElements.define('timeline-container', Timeline);

document.addEventListener("DOMContentLoaded", () => {
  const createDataScrollAttr = () => document.createAttribute("data-scroll");
  const createDataScrollStickyAttr = () => document.createAttribute("data-scroll-sticky");
  const createDataScrollOffsetAttr = () => {
    let dataScrollOffset = document.createAttribute("data-scroll-offset");
    dataScrollOffset.value = "-10%, 5%";
    return dataScrollOffset;
  };

  const timelines = document.querySelectorAll("#skills timeline-container");
  for (let i = 0; i < timelines.length; i++) {
    const timeline = timelines[i];

    let offset = 0;
    let pastOffset = 0;
    
    let pointPositions = [];

    const timelineYears = timeline.querySelectorAll("section.year");
    const timelineFutureSections = timeline.querySelectorAll("section.year section.future");

    for (let j = 0; j < timelineYears.length; j++) {
      const yearSection = timelineYears[j];

      let sectionOffset = 0;

      const timelineYearSections = yearSection.querySelectorAll("section");
      
      for (let k = 0; k < timelineYearSections.length; k++) {
        const section = timelineYearSections[k];

        const isFirstSection = k == 0;
        const isLastSection = k == timelineYearSections.length - 1;

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
          dataScrollTarget.value = `#skills timeline-container:nth-of-type(${i + 1}) section.year:nth-child(${j + 1})`;

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
    const progressPercent = pixelPercent * pastOffset;
    const progressPercentVar = `--timeline${i + 1}-progressPercent`

    pointPositions = pointPositions.map(point => { return { element: point.element, offset: pixelPercent * point.offset + 20 * pixelPercent } });
    document.documentElement.style.setProperty(progressPercentVar, "0%");

    const getCurrentProgress = () => document.documentElement.style.getPropertyValue(progressPercentVar);
    const getPastPoints = () => pointPositions.filter(position => parseFloat(position.offset) <= parseFloat(getCurrentProgress()));
    const getFuturePoints = () => pointPositions.filter(position => parseFloat(position.offset) >= parseFloat(getCurrentProgress()));

    function resetPointsStyle() {
      getPastPoints().forEach(point => {
        point.element.classList.remove("future", "pseudo-future");
        pointPositions[pointPositions.indexOf(point)].isPast = true;
      });

      getFuturePoints().forEach(point => {
        point.element.classList.add("future", "pseudo-future");
        pointPositions[pointPositions.indexOf(point)].isPast = false;
      });
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: `#skills timeline-container:nth-of-type(${i + 1})`,
        start: "top bottom-=30%",
        end: "bottom-=20%",
        scrub: 1,
        onUpdate: trigger => {
          if (trigger.direction == 1) {
            const pastPoints = getPastPoints();
            for (let j = 0; j < pastPoints.length; j++) {
              const point = pastPoints[j];
              if (point.isPast) continue;

              point.element.classList.remove("future", "pseudo-future");
              pointPositions[pointPositions.indexOf(point)].isPast = true;
            }
          } else if (trigger.direction == -1) {
            const futurePoints = getFuturePoints();
            for (let j = 0; j < futurePoints.length; j++) {
              const point = futurePoints[j];
              if (!point.isPast) continue;

              point.element.classList.add("future", "pseudo-future");
              pointPositions[pointPositions.indexOf(point)].isPast = false;
            }
          }
        },
      },
      onComplete: resetPointsStyle,
      onReverseComplete: resetPointsStyle
    })
      .fromTo(document.documentElement,
        { [progressPercentVar]: 0 },
        { [progressPercentVar]: progressPercent });

    const timelineStyle = document.head.appendChild(document.createElement("style"));
    timelineStyle.innerHTML = `#skills timeline-container:nth-of-type(${i + 1}):after { background: linear-gradient(180deg, rgb(var(--timeline-accent-rgb)) 0%, rgb(var(--timeline-accent-rgb)) calc(var(${progressPercentVar}) - ${20 * pixelPercent}%), rgba(var(--foreground-rgb), 0.1) calc(var(${progressPercentVar}) - ${8 * pixelPercent}%), rgba(var(--foreground-rgb), 0.1) 100%) !important; }`;
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
