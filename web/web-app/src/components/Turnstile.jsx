import React, { useEffect, useRef } from 'react';

const Turnstile = ({ sitekey, onVerify }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);

  // Keep ref updated with latest callback
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    // 1. Định nghĩa hàm render widget
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: sitekey,
            callback: (token) => {
              onVerifyRef.current(token);
            },
            'expired-callback': () => {
              onVerifyRef.current(null);
            },
            'error-callback': () => {
              onVerifyRef.current(null);
            },
          });
        } catch (err) {
          console.error("Lỗi render Turnstile:", err);
        }
      }
    };

    // 2. Tải script tự động nếu chưa có
    if (!window.turnstile) {
      let script = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      const handleLoad = () => {
        renderWidget();
      };

      script.addEventListener('load', handleLoad);

      // Phòng trường hợp script được tải song song hoặc nhanh hơn
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          renderWidget();
          clearInterval(checkInterval);
        }
      }, 100);

      return () => {
        script.removeEventListener('load', handleLoad);
        clearInterval(checkInterval);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    } else {
      renderWidget();
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }
  }, [sitekey]);

  return (
    <div className="w-full flex justify-center my-3 min-h-[65px]">
      <div ref={containerRef} />
    </div>
  );
};

export default Turnstile;
