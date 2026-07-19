$(function () {
  // ---------- 0. 固定リンクを共通生成 ----------
  $(".menu-static-links").html(`
    <li><a class="head" href="vip.html">vip</a></li>
    <li><a class="head" href="vip2020.html">2020</a></li>
    <li><a class="head" href="shallow.html">2021</a></li>
    <li><a class="head" href="mi.html">2022-23</a></li>
    <li><a class="head" href="archieve.html">2024-26</a></li>
    <li>
      <a class="head" href="https://ameblo.jp/moshimoshic">blog</a>
      <a class="head" href="https://mari6f.hatenablog.com/">blog(new)</a>
      <a class="head" href="https://note.com/kame75">note</a>
    </li>
    <li><a class="head" href="https://twitter.com/home">twitter</a></li>
`);

  // ---------- 1. アウトラインを見出しから自動生成 ----------
  const $outline = $("#outline-list");

  $("#main-content h1").each(function () {
    const $h = $(this);

    if (!$h.attr("id")) {
      // idが無い見出しには自動採番
      $h.attr("id", "auto-" + Math.random().toString(36).slice(2, 8));
    }

    const li = $("<li>")
      .addClass("outline-h1")
      .append(
        $("<a>")
          .attr("href", "#" + $h.attr("id"))
          .text($h.text()),
      );

    $outline.append(li);
  });

  const $outlineLinks = $outline.find("a");

  // ---------- 2. クリックで該当箇所へジャンプ ----------
  $outlineLinks.on("click", function (e) {
    e.preventDefault();

    const target = document.getElementById($(this).attr("href").slice(1));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // モバイルでリンクを押したらメニューを閉じる
    if (window.innerWidth <= 600) {
      closeMenu();
    }
  });

  // ---------- 3. ハンバーガー開閉 ----------
  function openMenu() {
    $("#hamburger-menu").addClass("open");
    $("#menu-container .menu-list").addClass("active");
    $("body").addClass("overflow-hidden");
  }

  function closeMenu() {
    $("#hamburger-menu").removeClass("open");
    $("#menu-container .menu-list").removeClass("active");
    $("body").removeClass("overflow-hidden");
  }

  $("#menu-wrapper").on("click", function (event) {
    event.stopPropagation();

    if ($("#menu-container .menu-list").hasClass("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // ---------- 4. スクロールスパイ ----------
  const headings = $("#main-content h1").toArray();

  function updateCurrent() {
    const scrollPos = window.scrollY + window.innerHeight * 0.25;
    let currentId = null;

    for (const h of headings) {
      if (h.offsetTop <= scrollPos) {
        currentId = h.id;
      } else {
        break;
      }
    }

    $outlineLinks.removeClass("current");

    if (currentId) {
      const $current = $outlineLinks.filter('[href="#' + currentId + '"]');

      $current.addClass("current");
      scrollOutlineToCurrent($current);
    }
  }

  // ---------- 5. アウトライン自身のスクロール追従 ----------
  function scrollOutlineToCurrent($current) {
    if (!$current.length) return;

    const container = $("#outline-list")[0];
    const link = $current[0];

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;

    if (linkTop < containerTop) {
      container.scrollTo({
        top: linkTop,
        behavior: "smooth",
      });
    } else if (linkBottom > containerBottom) {
      container.scrollTo({
        top: linkBottom - container.clientHeight,
        behavior: "smooth",
      });
    }
  }

  let ticking = false;

  $(window).on("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateCurrent();
        ticking = false;
      });

      ticking = true;
    }
  });

  updateCurrent();
});
