(function () {
  // Add styles
  const style = document.createElement("style");
  style.innerHTML = `
    #support-frame {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 600px;
      height: 500px;
      border: none;
      border-radius: 12px;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 20px;
      z-index: 999999;
      overflow: hidden;
      transform: translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s ease-in-out;
    }

    #support-frame.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    @media (max-width: 768px) {
      #support-frame {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
    }

    #support-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #2567B3;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }

    #support-toggle:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);

  // SVG icons
  const chatIcon = `
    <svg width="28" height="28" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,2 L16,10.4444444 C16,11.5490139 15.1045695,12.4444444 14,12.4444444 
      L11.9109137,12.4444444 L11.9109137,16 L7.74039,12.4444444 
      L2,12.4444444 C0.8954305,12.4444444 0,11.5490139 0,10.4444444 
      L0,2 C0,0.8954305 0.8954305,0 2,0 L14,0 
      C15.1045695,0 16,0.8954305 16,2 Z" fill="#fff"/>
    </svg>
  `;

  const crossIcon = `
    <svg width="24" height="24" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <polygon fill="#fff" points="14 1.41 12.59 0 7 5.59 
      1.41 0 0 1.41 5.59 7 0 12.59 
      1.41 14 7 8.41 12.59 14 
      14 12.59 8.41 7"/>
    </svg>
  `;

  // Create toggle button
  const toggleBtn = document.createElement("div");
  toggleBtn.id = "support-toggle";
  toggleBtn.innerHTML = chatIcon;
  document.body.appendChild(toggleBtn);

  // Create iframe
  const frame = document.createElement("iframe");
  frame.id = "support-frame";
  frame.src = "http://localhost:3010/support?widgetId=null";
  document.body.appendChild(frame);

  // Toggle logic
  let isOpen = false;
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    frame.classList.toggle("open");
    toggleBtn.innerHTML = isOpen ? crossIcon : chatIcon;
  });
})();
