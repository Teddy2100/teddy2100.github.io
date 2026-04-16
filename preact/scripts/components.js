import { useMemo, useRef, useState, useEffect, useLayoutEffect, useErrorBoundary, useLibrary, useContainer } from "./hooks.js";
import { h, Fragment, Component } from "./provider.js";
import { animate, utils } from './provider.js';

export function ErrorHandler({ children }) {
  const textareaRef = useRef();
  const [status, setStatus] = useState(null);
  const [error, resetError] = useErrorBoundary();
  const purgeErrors = () => { setStatus(null), resetError() };
  const addr = new URL(window.location.toString());
  
  const Container = useContainer("article", {
    "div.body": {
      padding: 0,
      "pre":{
        width: "100%",
        padding: "10px",
        resize: "none",
        whiteSpace: "pre",
        overflowX: "scroll",
        fontFamily: "monospace",
        fontSize: "12px",
        backgroundColor: "lightgrey",
        color: "black",
        cursor: "text",
        margin: 0,
      },
    },
  });
  
  useLayoutEffect(function(){
    const ctrl = new AbortController();
    const options = { signal: ctrl.signal };
    // Update Status Listeners
    window.addEventListener("offline", (e) => setStatus("You are currently offline."), options);
    window.addEventListener("error", (e) => setStatus("Error:"+e.error || e.message || "Runtime Error"), options);
    window.addEventListener("unhandledrejection", (e) => setStatus(e.reason || e.error || "Async Rejection"), options);
    window.addEventListener("securitypolicyviolation", (e) => setStatus(`Security Block: Cannot load ${e.blockedURI} due to ${event.violatedDirective} policy.`), options);
    // Purge Status Listeners
    window.addEventListener("hashchange", (e) => purgeErrors(), options);
    window.addEventListener("online", (e) => purgeErrors(), options);
    return function(){
      ctrl.abort();
    }
  }, []);
  
  if (error == null && status == null) return children;
  if (status) console.warn("Caught Global/Async Error:", status);
  if (error) console.warn("Caught Render Error:", error);
  
  return h(Container, { class:"red" }, [
    h("div", { class:"header" }, "🚦Something Went Wrong"),
    h("div", { class:"body" }, [
      h("pre", { 
        ref: textareaRef,
        children: JSON.stringify({
          error: {
            datetime: Date().toString(),
            description: (status || error).toString(),
          },
          request: {
            href: addr.href,
            protocol: addr.protocol,
            host: addr.host,
            hostname: addr.hostname,
            port: addr.port,
            pathname: addr.pathname,
            search: addr.search,
            hash: addr.hash,
            origin: addr.origin
          }
        }, null, 2),
      }),
    ]),
    h("div", {class:"footer"}, [
      h("button", {
        children: "Report Error",
        onClick: () => fetch("https://ntfy.sh/7c1cfdb6-96e6-4367-bd88-133c72f4ae2a", {
          headers: { priority: "high", title: "Error Report", tags: "vertical_traffic_light" },
          body: textareaRef.current.innerHTML,
          method: "POST",
        }),
      }),
    ]),
  ]);
}

export function Card({ ...props }) {
  return h("article", {
    class: "app-card",
    ...props,
  });
};

export function NotFound({ ...props }) {
  throw new Error("Page Not Found");
};

export function WhenReady({ isReady, type, ...props }) {
  if (isReady !== true) return h(Fragment, null);
  return h(type || Fragment, props);
};

export function Loader() {
  const Footer = useContainer("footer", {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "auto",
    "svg": {
      margin: "64px auto",
      height: "64px",
    },
  });
  return h(Footer, null, [
    h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" }, [
      h("path", {
        fill: "currentColor",
        d: "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z",
      }),
      h("rect", {
        fill: "#673AB8",
        width: "2",
        height: "7",
        x: "11",
        y: "6",
        rx: "1",
        children: h("animateTransform", {
          attributeName: "transform",
          dur: "9s",
          repeatCount: "indefinite",
          type: "rotate",
          values: "0 12 12;360 12 12",
        }),
      }),
      h("rect", {
        fill: "#45CAFF",
        width: "2",
        height: "9",
        x: "11",
        y: "11",
        rx: "1",
        children: h("animateTransform", {
          attributeName: "transform",
          dur: "0.75s",
          repeatCount: "indefinite",
          type: "rotate",
          values: "0 12 12;360 12 12",
        }),
      }),
    ]),
  ]);
}

export function Dock({ children, size = 300, ...props }) {
  const handleRef = useRef(null);

  const [dockStyle, setDockStyle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const handleHeight = 40;
  const openPos = 0;
  const closedPos = size - handleHeight;

  function handleStart(e) {
    if (handleRef.dockY == null) handleRef.dockY = Math.round(size - 40);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    handleRef.clientY = clientY;
    setIsDragging(true);
  };

  function handleMove(e) {
    if (isDragging !== true) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = Number.parseFloat(handleRef.dockY + (clientY - handleRef.clientY));
    const dockY = Math.max(openPos, Math.min(deltaY.toFixed(4), closedPos));
    setDockStyle(`transform: translateY(${Math.round(dockY)}px)`);
    handleRef.clientY = clientY;
    handleRef.dockY = dockY;
  };

  function handleEnd() {
    setIsDragging(false);
    const snapPoint = (size - 40) / 2;
    const snapTo = handleRef.dockY < snapPoint ? openPos : closedPos; 
    setDockStyle(`transform: translateY(${snapTo}px)`);
    handleRef.dockY = snapTo;
  };
  
  useLayoutEffect(function() {
    if (isDragging !== true) return;
    const ctrl = new AbortController(true);
    window.addEventListener('mousemove', handleMove, { signal: ctrl.signal });
    window.addEventListener('mouseup', handleEnd, { signal: ctrl.signal });
    window.addEventListener('touchmove', handleMove, { signal: ctrl.signal, passive: false });
    window.addEventListener('touchend', handleEnd, { signal: ctrl.signal });
    return function() {
      ctrl.abort();
    };
  }, [
    isDragging,
  ]);

  return h('div', {
    class: useStyles({
      position: 'fixed',
      bottom: 0,
      zIndex: 1000,
      height: `${size}px`,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px 12px 0 0',
      maxWidth: "calc(800px - 10px)",
      width: "calc(100dvw - 10px)",
      margin: "0px -5px",
      touchAction: 'none',
      transform: `translateY(${closedPos}px)`,
      willChange: 'transform',
      overflow:"hidden"
    }),
    style: dockStyle,
    ...props
  }, [
    h('div', {
      ref: handleRef,
      onMouseDown: handleStart, 
      onTouchStart: handleStart,
      class: useStyles({
        /* Display & Box Model */
        height: `${handleHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        /* Visuals */
        backgroundImage: [
          "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          "linear-gradient(315deg, rgba(69,202,255,1) 0%, rgba(181,61,254,1) 40%, rgba(181,61,254,1) 60%, rgba(103,58,184,1) 100%)",
        ].join(", "),
        backgroundColor: '#fdfdfd',
        color:"red",
        span: {
          /* Display & Box Model */
          width: '32px',
          height: '4px',
          backgroundImage: "linear-gradient(rgb(48, 48, 48) 13%, rgb(30, 30, 30) 40%, #0c0d11 86%)",
          backgroundColor: '#e5e5e5',
          borderRadius: '2px'
        }
      }),
    }, [
      h('span', null),
    ]),
    h("div", {
      class: useStyles({
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        fontFamily: 'system-ui, sans-serif',
        background:"white",
      }),
      //children
    })
  ]);
};

export function Sketch({ project, disableScroll, ...props }) {
  const projectRef = useRef({ el:null });
  
  function sketch(p){
    // Declare the setup() method.
    p.setup = async function () {
      p.createCanvas(100, 100);
    };
      
    // Declare the draw() method.
    p.draw = async function () {
      p.background(200);
      // Draw the circle.
      p.circle(p.mouseX, p.mouseY, 20);
    };
      
    // Declare the doubleClicked() method.
    p.doubleClicked = async function () {
      // Change the fill color when the user double-clicks.
      p.fill(0);
    };
  };
  
  useLibrary("https://cdn.jsdelivr.net/npm/p5@2.2.0/lib/p5.esm.js", function(lib){
    const scrollLock = (e) => e.preventDefault();
    const instance = new lib.default(sketch, projectRef.current);
    document.querySelectorAll("div#p5_loading").forEach(x => x.remove());
    if (instance && instance.canvas && Boolean(disableScroll) === true) {
      instance.canvas.addEventListener("touchstart", scrollLock, { passive: false });
      instance.canvas.addEventListener("touchmove", scrollLock, { passive: false });
      instance.canvas.addEventListener("touchend", scrollLock, { passive: false });
    }
    return function() {
      if (typeof instance.remove == "function") instance.remove();
      // projectUnmount(false);
    };
    /**/
  });
  return h("div", {
    ref: projectRef,
    id: "noop",
  });
};

export function Article(props){
  console.warn("Use: Card, Article no longer in use..")
  return h(Card, props);
}

export {
  // Provider Hooks
  Component,
  Fragment, 
  h,
}