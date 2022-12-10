"use strict";

/* navbar */
const navbar = document.querySelector(".navbar-container");
const navbarMenu = document.querySelector(".menu");
const navbarMenuItems = document.querySelectorAll(".menu-item");

/* navbar visiblity event 컨트롤 */
const header = document.querySelector("#header");
const headerHeight = header.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  if (window.scrollY > headerHeight) {
    navbar.classList.add("navbar-visible");
  } else {
    navbar.classList.remove("navbar-visible");
  }
});

/* navbar 메뉴 선택시 해당 section으로 이동 */
scrollIntoView(navbarMenu);

/* navbar 메뉴 선택시 해당 메뉴 아이템에 선택되었음을 표시 */
navbarMenu.addEventListener("click", (e) => {
  activation(navbarMenuItems, e);
});

/* upBtn */
const upBtn = document.querySelector(".up-btn");

/* upBtn visibility event 컨트롤 */
const intro = document.querySelector("#intro");
const introHeight = intro.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  if (window.scrollY > introHeight / 2) {
    upBtn.classList.add("visible");
  } else {
    upBtn.classList.remove("visible");
  }
});

/* upBtn 클릭 시 header로 이동 */
scrollIntoView(upBtn);

/* intro */
const introContents = document.querySelector("#intro .container");
/* 스크롤 이벤트 발생시 intro 콘텐츠 fadeOut 효과 적용 */
document.addEventListener("scroll", () => fadeOutOnScroll(introContents));

/* // Navbar toggle button
const toggleBtn = document.querySelector(".toggle-btn");

toggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("active");
});
// Close the menu item when menu item is clicked
navbarMenu.addEventListener("click", () => {
  navbarMenu.classList.remove("active");
});
// Close the menu item when document is scrolled
document.addEventListener("scroll", () => {
  navbarMenu.classList.remove("active");
}); */

const sectionIds = [
  "#about",
  "#projects",
  "#skills",
  "#other-experience",
  "#experience",
  "#education",
];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link='${id}']`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

function scrollIntoView(selector) {
  selector.addEventListener("click", (event) => {
    const target = event.target;
    const link = target.dataset.link;

    if (link == null) {
      return;
    }
    const scrollTo = document.querySelector(link);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(link)]);
  });
}

function fadeOutOnScroll(el) {
  if (!el) {
    return;
  }

  const distanceToTop = window.pageYOffset + el.getBoundingClientRect().top;
  const elementHeight = el.offsetHeight;
  const scrollTop = document.documentElement.scrollTop;

  let opacity = 1;

  if (scrollTop > distanceToTop) {
    opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
  }

  if (opacity >= 0) {
    el.style.opacity = opacity;
  }
}

function activation(items, event) {
  const filter =
    event.target.dataset.filter || event.target.parentNode.dataset.filter;

  if (filter == null) {
    return;
  }

  items.forEach((item) => {
    if (filter === item.dataset.filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

const observerOptions = {
  threshold: 0.4,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// Active navbar menu item when viewport is located on top and bottom page
window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
