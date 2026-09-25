(function () {
  var KEY = "reading-room:last";
  var links = null;

  function here() {
    return location.origin + location.pathname + location.hash;
  }

  function remember() {
    if (location.pathname === "/") return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          href: here(),
          title: document.title.replace(/\s·\s.*/, ""),
          at: Date.now(),
        }),
      );
    } catch {
      /* private mode */
    }
  }

  function show() {
    var old = document.querySelector("[data-reading-room]");
    if (old) old.remove();
    if (!links) return;
    var list = links[here()] || links[here().replace(/\/#/, "#")];
    if (!list || !list.length) return;
    var aside = document.createElement("aside");
    aside.setAttribute("data-reading-room", "");
    aside.style.cssText =
      "max-width:48rem;margin:2rem auto 3rem;padding:0 1.25rem;font:16px/1.7 'Noto Sans SC',sans-serif;color:#5c554c";
    var title = document.createElement("p");
    title.textContent = "这条在别处";
    title.style.cssText = "margin:0 0 .4rem;font-weight:700;color:#1c1916";
    aside.appendChild(title);
    list.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.book + " · " + item.title;
      link.style.cssText = "display:block;color:#1c3d36;font-weight:600";
      aside.appendChild(link);
    });
    var home = document.createElement("a");
    home.href = "https://brianbai1123.github.io/";
    home.textContent = "回到藏书室";
    home.style.cssText = "display:inline-block;margin-top:.6rem;color:#8a4b32";
    aside.appendChild(home);
    document.body.appendChild(aside);
  }

  function homeButton() {
    if (location.pathname === "/" || document.querySelector("[data-reading-room-home]")) return;
    var link = document.createElement("a");
    link.href = "https://brianbai1123.github.io/";
    link.setAttribute("data-reading-room-home", "");
    link.textContent = "← 回到藏书室";
    link.style.cssText = [
      "position:fixed",
      "z-index:80",
      "left:16px",
      "bottom:16px",
      "padding:10px 14px",
      "border-radius:999px",
      "background:#1c3d36",
      "color:#f7f3eb",
      "font:600 14px/1.2 'Noto Sans SC',sans-serif",
      "text-decoration:none",
      "box-shadow:0 8px 24px rgba(28,25,22,.18)",
    ].join(";");
    document.body.appendChild(link);
  }

  function tick() {
    remember();
    homeButton();
    show();
  }

  homeButton();

  fetch("/crosslinks.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      links = data;
      tick();
    })
    .catch(function () {
      tick();
    });

  window.addEventListener("hashchange", tick);
  setTimeout(tick, 400);
})();
