document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".header__burger");
  const header = document.querySelector(".header");
  const navLinks = document.querySelectorAll(".header__nav a");

  burger.addEventListener("click", () => {
    header.classList.toggle("menu-open");
    document.body.classList.toggle("lock"); // блокуємо скрол
  });

  // Закриття меню після кліку на будь-який лінк
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      document.body.classList.remove("lock");
    });
  });
});

document.addEventListener("click", (e) => {
  const nav = document.querySelector(".header__nav");
  const burger = document.querySelector(".header__burger");
  const header = document.querySelector(".header");

  if (header.classList.contains("menu-open") &&
      !nav.contains(e.target) &&
      !burger.contains(e.target)) {
    header.classList.remove("menu-open");
    document.body.classList.remove("lock");
  }
});
