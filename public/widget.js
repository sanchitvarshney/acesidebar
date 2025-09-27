/********************************************************************
 *  Chat-widget – lazy iframe + loader in button
 *  Pop-up : fade + scale  |  Slider : slide-in + fade (open & close)
 *******************************************************************/
(function () {
  const configV = window.ajxtrChatBot?.visitor || {};
  const configB = window.ajxtrChatBot?.bot || {};
  const { buttonColor = "#2567B3", sliderStyle = "pop", position = "br" } = configB;

  /* ----------  CSS  (icons + spinner + animations) ---------- */
  const style = document.createElement("style");
  style.innerHTML = `
    #support-frame{
      position:fixed; border:none; z-index:999999; overflow:hidden;
      pointer-events:none; display:none;  
    }
    #support-frame.pop{
      width:35%; height:500px; bottom:100px; right:20px;
      opacity:0; transform:translateY(20px);
      transition:opacity .4s ease, transform .4s ease;
      border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.2);
    }
    #support-frame.pop.open{ opacity:1; transform:translateY(0); pointer-events:auto; }

    #support-frame.slider{
      top:0; bottom:0; height:100vh; width:0;
      right:0; left:auto;                         
      opacity:0; transform:translateX(100%);      
      transition:width .35s ease-out, transform .35s ease-out, opacity .25s ease;
      border-top-left-radius:12px;
      border-bottom-left-radius:12px;
      border-left:1px solid #ccc;
      box-shadow:-3px 0px 5px -2px rgba(0, 0, 0, .2)
    }
    #support-frame.slider.open{
      width:30%; transform:translateX(0); opacity:1; pointer-events:auto;
    }
    /* when closing we let it slide back */
    #support-frame.slider.closing{
      width:0; transform:translateX(100%); opacity:0;
    }

    @media(max-width:768px){
      #support-frame.pop{ width:100vw; height:100vh; bottom:0; right:0; border-radius:0; }
      #support-frame.slider{ width:0; }                    
      #support-frame.slider.open{ width:100vw; }
    }

    #support-toggle{
      position:fixed; width:60px; height:60px; border-radius:50%;
      background:${buttonColor}; color:#fff; cursor:pointer; z-index:1000000;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 4px 12px rgba(0,0,0,.2); transition:transform .3s ease;
    }
    #support-toggle:hover{ transform:scale(1.1); }

    .ajxtr-loader{
      width:24px; height:24px; border:3px solid rgba(255,255,255,.3);
      border-top-color:#fff; border-radius:50%;
      animation:ajxtr-spin .8s linear infinite;
    }
    @keyframes ajxtr-spin{ to{ transform:rotate(360deg); } }
  `;
  document.head.appendChild(style);

  /* ---- icons ---- */
  const chatIcon = `<svg width="28" height="28" viewBox="0 0 16 16"><path d="M16,2 L16,10.44C16,11.55 15.1,12.44 14,12.44L11.91,12.44L11.91,16L7.74,12.44L2,12.44C0.9,12.44 0,11.55 0,10.44L0,2C0,0.9 0.9,0 2,0L14,0C15.1,0 16,0.9 16,2Z" fill="#fff"/></svg>`;
  const crossIcon = `<svg width="24" height="24" viewBox="0 0 14 14"><polygon fill="#fff" points="14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7"/></svg>`;
  const loader = `<div class="ajxtr-loader"></div>`;

  /* ---- toggle button ---- */
  const toggleBtn = document.createElement("div");
  toggleBtn.id = "support-toggle";
  toggleBtn.innerHTML = chatIcon;
  document.body.appendChild(toggleBtn);

  /* position button */
  const btnStyle = toggleBtn.style;
  if (position === "br") { btnStyle.bottom = "20px"; btnStyle.right = "20px"; }
  if (position === "bl") { btnStyle.bottom = "20px"; btnStyle.left  = "20px"; }

  /* ----------  STATE  ---------- */
  let isOpen = false;
  let frameBuilt = false;
  let loading = false;

  /* ----------  CLICK HANDLER  ---------- */
  toggleBtn.addEventListener("click", () => {
    if (loading) return;               // ignore clicks while loading
    if (!frameBuilt) {                 /* FIRST CLICK – build iframe */
      loading = true;
      frameBuilt = true;
      toggleBtn.innerHTML = loader;    // show spinner inside button

      const frame = document.createElement("iframe");
      frame.id = "support-frame";
      frame.src = "http://localhost:3010";

      frame.addEventListener("load", () => {
        loading = false;
        toggleBtn.innerHTML = crossIcon;
        frame.classList.add(sliderStyle);
        frame.style.display = "block";
        requestAnimationFrame(() => {
          frame.classList.add("open");
          isOpen = true;

          /* slider-only geometry (once) */
          if (sliderStyle === "slider") {
            frame.style.top = frame.style.bottom = "0";
            frame.style.height = "100vh";
            frame.style.right = position === "bl" ? "auto" : "0";
            frame.style.left  = position === "bl" ? "0" : "auto";
            frame.style.borderRadius = "0";
          }
        });
      });

      document.body.appendChild(frame);
      return;
    }

    /* -----  SUBSEQUENT CLICKS  ----- */
    const frame = document.getElementById("support-frame");
    isOpen = !isOpen;

    if (sliderStyle === "slider" && !isOpen) {
      /* SLIDER CLOSE animation */
      frame.classList.add("closing");
      toggleBtn.innerHTML = chatIcon;
      /* wait for slide to finish then hide */
      frame.addEventListener("transitionend", function handler() {
        frame.classList.remove("open", "closing");
        frame.removeEventListener("transitionend", handler);
      });
    } else {
      /* normal toggle for pop or slider-open */
      frame.classList.toggle("open", isOpen);
      toggleBtn.innerHTML = isOpen ? crossIcon : chatIcon;
    }
  });
})();