(function () {
    let config = null;

    fetch('./widget-config.json')
        .then(response => response.json())
        .then(data => {
            config = data;
            initializeWidget();
        })
        .catch(error => {
            config = {
                bot: window.ajxtrChatBot?.bot || {
                    buttonText: "default",
                    buttonColor: "#2567B3",
                    sliderStyle: "pop",
                    position: "br",
                    trigger: "default"
                },
                visitor: window.ajxtrChatBot?.visitor || { enabled: true }
            };
            initializeWidget();
        });

    function initializeWidget() {
        const configV = config.visitor || {};
        const configB = config.bot || {};
        const { buttonText = "default", buttonColor = "#2567B3", sliderStyle = "pop", position = "br" } = configB;
        const trigger = configB.trigger || 'default';   // "default" | "element-id"
        const isDefault = trigger === 'default';

        if (window.innerWidth <= 768) {
            console.log("Mobile detected - width:", window.innerWidth);
        }

         function loadExternalFiles() {
             const settings = config.settings;

             // Load CSS files
             if (settings && settings.css) {
                 Object.values(settings.css).forEach(cssUrl => {
                     const cssLink = document.createElement("link");
                     cssLink.rel = "stylesheet";
                     cssLink.href = cssUrl;
                     document.head.appendChild(cssLink);
                     console.log("CSS loaded:", cssUrl);
                 });
             }

             // Load JS files
             if (settings && settings.js) {
                 const jsUrls = Object.values(settings.js);
                 let loadedCount = 0;
                 
                 jsUrls.forEach(jsUrl => {
                     const jsScript = document.createElement("script");
                     jsScript.src = jsUrl;
                     jsScript.onload = function () {
                         loadedCount++;
                         console.log("JS loaded:", jsUrl);
                         
                         // Initialize widget when all JS files are loaded
                         if (loadedCount === jsUrls.length) {
                             if (window.AjaxterWidget) {
                                 window.AjaxterWidget.init(config);
                             }
                         }
                     };
                     document.head.appendChild(jsScript);
                 });
             }
         }

        loadExternalFiles();

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-YHXH9TZ69K');

        const chatIcon = `<svg width="28" height="28" viewBox="0 0 16 16"><path d="M16,2 L16,10.44C16,11.55 15.1,12.44 14,12.44L11.91,12.44L11.91,16L7.74,12.44L2,12.44C0.9,12.44 0,11.55 0,10.44L0,2C0,0.9 0.9,0 2,0L14,0C15.1,0 16,0.9 16,2Z" fill="#fff"/></svg>`;
        const crossIcon = `<svg width="24" height="24" viewBox="0 0 14 14"><polygon fill="#fff" points="14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7"/></svg>`;
        const loader = `<div class="ajxtr-loader"></div>`;

        const toggleBtn = document.createElement("div");
        toggleBtn.id = "support-toggle";

        if (buttonText !== "default") {
            toggleBtn.classList.add("chat-button");
            toggleBtn.classList.add(`position-${position}`);
            const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
        } else {
            toggleBtn.innerHTML = chatIcon;
        }

        toggleBtn.style.setProperty('--button-color', buttonColor);

        const badge = document.createElement("div");
        badge.id = "support-badge";
        badge.textContent = "0";
        toggleBtn.appendChild(badge);

        if (isDefault) {
            document.body.appendChild(toggleBtn);
            const btnStyle = toggleBtn.style;

            function updateButtonPosition() {
                btnStyle.top = 'auto';
                btnStyle.bottom = 'auto';
                btnStyle.left = 'auto';
                btnStyle.right = 'auto';
                btnStyle.transform = 'none';

                if (buttonText !== "default") {
                    btnStyle.top = '50%';
                    btnStyle.transform = 'translateY(-50%)';
                    btnStyle.bottom = 'auto';

                    if (position === 'br') {
                        btnStyle.right = '2px';
                        btnStyle.left = 'auto';
                    } else if (position === 'bl') {
                        btnStyle.left = '2px';
                        btnStyle.right = 'auto';
                    }
                    return;
                }

                if (window.innerWidth <= 768) {
                    if (position === 'br') {
                        btnStyle.bottom = 'max(20px, env(safe-area-inset-bottom))';
                        btnStyle.right = 'max(20px, env(safe-area-inset-right))';
                        btnStyle.left = 'auto';
                    }
                    if (position === 'bl') {
                        btnStyle.bottom = 'max(20px, env(safe-area-inset-bottom))';
                        btnStyle.left = 'max(20px, env(safe-area-inset-left))';
                        btnStyle.right = 'auto';
                        btnStyle.top = 'auto';
                    }
                } else {
                    if (position === 'br') {
                        btnStyle.bottom = '20px';
                        btnStyle.right = '20px';
                        btnStyle.left = 'auto';
                    }
                    if (position === 'bl') {
                        btnStyle.bottom = '20px';
                        btnStyle.left = '20px';
                        btnStyle.right = 'auto';
                        btnStyle.top = 'auto';
                    }
                }
            }

            updateButtonPosition();

            setTimeout(() => {
                updateButtonPosition();
            }, 100);

            window.addEventListener('resize', updateButtonPosition);

        }

        let isOpen = false;
        let frameBuilt = false;
        let loading = false;
        let unreadCount = 0;

        function updateMobileViewport() {
            const frame = document.getElementById("support-frame");
            if (frame && isOpen && window.innerWidth <= 768) {
                frame.style.height = "100vh";
                frame.style.height = "100dvh";
                frame.style.top = "0";
                frame.style.left = "0";
                frame.style.right = "0";
                frame.style.bottom = "0";
                frame.style.width = "100vw";
                frame.style.borderRadius = "0";
                frame.style.position = "fixed";
                frame.style.zIndex = "999999";
            }
        }

        window.addEventListener('resize', updateMobileViewport);
        window.addEventListener('orientationchange', function () {
            setTimeout(updateMobileViewport, 100); 
        });

        if (window.addEventListener) {
            window.addEventListener('message', function (event) {
                if (event.data && event.data.type === 'iframe' && event.data.close === true) {
                    closeIframe();
                }

                if (event.data && event.data.type === 'unread_count') {
                    updateUnreadCount(event.data.count || 0);
                }

                if (event.data && event.data.type === 'new_message') {
                    if (!isOpen) {
                        incrementUnreadCount();
                    }
                }
            });
        }

         function closeIframe() {
             const frame = document.getElementById("support-frame");
             const toggleBtn = document.getElementById("support-toggle");

             if (frame && isOpen) {
                 isOpen = false;
                 
                 // Restore pull-to-refresh when widget is closed
                 document.body.style.overscrollBehavior = '';
                 document.documentElement.style.overscrollBehavior = '';

                if (sliderStyle === "slider") {
                    frame.classList.add("closing");
                    if (isDefault && toggleBtn) {
                        if (buttonText !== "default") {
                            const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
                            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
                        } else {
                            toggleBtn.innerHTML = chatIcon;
                        }
                    }
                    frame.addEventListener("transitionend", function handler() {
                        frame.classList.remove("open", "closing");
                        frame.removeEventListener("transitionend", handler);
                    });
                } else {
                    frame.classList.remove("open");
                    if (isDefault && toggleBtn) {
                        if (buttonText !== "default") {
                            const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
                            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
                        } else {
                            toggleBtn.innerHTML = chatIcon;
                        }
                    }
                }
            }
        }

        function updateUnreadCount(count) {
            unreadCount = count;
            const badge = document.getElementById("support-badge");
            if (badge) {
                badge.textContent = count > 99 ? '99+' : count.toString();
                if (count > 0) {
                    badge.classList.add('show');
                    if (count === 1) {
                        badge.classList.add('pulse');
                        setTimeout(() => badge.classList.remove('pulse'), 600);
                    }
                } else {
                    badge.classList.remove('show');
                }
            }
        }

        function incrementUnreadCount() {
            unreadCount++;
            updateUnreadCount(unreadCount);
        }

        function clearUnreadCount() {
            updateUnreadCount(0);
        }

        function toggleChat() {
            if (loading) return;
            if (!frameBuilt) {
                loading = true;
                if (isDefault) toggleBtn.innerHTML = loader;
                frameBuilt = true;

                const frame = document.createElement("iframe");
                frame.id = "support-frame";
                frame.src = "https://chat-bot-blond-seven.vercel.app";
                frame.setAttribute("allow", "camera; microphone; geolocation");
                frame.setAttribute("sandbox", "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox");

                frame.addEventListener("load", () => {
                    loading = false;
                    if (isDefault) {
                        if (buttonText !== "default") {
                            const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
                            toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
                        } else {
                            toggleBtn.innerHTML = crossIcon;
                        }
                    }
                    frame.classList.add(sliderStyle);
                    frame.classList.add(`position-${position}`);
                    if (buttonText !== "default") {
                        frame.classList.add("chat-button");
                    }
                    frame.style.display = "block";
                     requestAnimationFrame(() => {
                         frame.classList.add("open");
                         isOpen = true;
                         clearUnreadCount();
                         
                         // Prevent pull-to-refresh on mobile when widget is open
                         document.body.style.overscrollBehavior = 'none';
                         document.documentElement.style.overscrollBehavior = 'none';

                        if (sliderStyle === "slider") {
                            frame.style.top = frame.style.bottom = "0";
                            frame.style.height = "100vh";
                            frame.style.right = position === "bl" ? "auto" : "0";
                            frame.style.left = position === "bl" ? "0" : "auto";
                            frame.style.borderRadius = "0";
                        }

                        if (window.innerWidth <= 768) {
                            frame.style.height = "100vh";
                            frame.style.height = "100dvh"; // Use dynamic viewport height
                            frame.style.top = "0";
                            frame.style.left = "0";
                            frame.style.right = "0";
                            frame.style.bottom = "0";
                            frame.style.width = "100vw";
                            frame.style.borderRadius = "0";
                            frame.style.position = "fixed";
                            frame.style.zIndex = "999999";

                        }
                    });
                });

                document.body.appendChild(frame);
                return;
            }

            const frame = document.getElementById("support-frame");
            isOpen = !isOpen;

            if (sliderStyle === "slider" && !isOpen) {
                frame.classList.add("closing");
                if (isDefault) {
                    if (buttonText !== "default") {
                        const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
                        toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
                    } else {
                        toggleBtn.innerHTML = chatIcon;
                    }
                }


                frame.addEventListener("transitionend", function handler() {
                    frame.classList.remove("open", "closing");
                    frame.removeEventListener("transitionend", handler);
                });
            } else {
                frame.classList.toggle("open", isOpen);
                if (isDefault) {
                    if (buttonText !== "default") {
                        const displayText = buttonText.length > 15 ? buttonText.substring(0, 15) + '...' : buttonText;
                        toggleBtn.innerHTML = `<span class="chat-text">${displayText}</span>`;
                    } else {
                        toggleBtn.innerHTML = isOpen ? crossIcon : chatIcon;
                    }
                }


                if (isOpen) {
                    clearUnreadCount();
                }
            }
        }

        if (isDefault) {
            toggleBtn.addEventListener("click", toggleChat);
        } else {
            function attachCustomTrigger() {
                const el = document.getElementById(trigger);
                if (el) { el.addEventListener("click", toggleChat); }
                else { setTimeout(attachCustomTrigger, 200); }
            }
            attachCustomTrigger();
        }

        window.toggleChatWidget = toggleChat;
    }
})();
