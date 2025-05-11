document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("toggle-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  } else if (!prefersDark) {
    document.body.classList.add("light-mode");
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", theme);
  });
});
