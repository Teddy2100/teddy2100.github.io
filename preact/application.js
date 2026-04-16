import { Fragment, ErrorHandler, WhenReady, Article, Loader } from "/scripts/components.js";
import { useContainer, useEventListener, useNetworkStatus, createLink } from "/scripts/hooks.js";
import { useRef, useMemo, useState, useEffect, useLayoutEffect } from "/scripts/hooks.js";
import { h, render, options, animate, utils, createTimeline } from "/scripts/provider.js";

function Printables({ id, ...props }) {
  const Container = useContainer("section", {
    "@media print": {
      "body > *:not(section#printables)": {
        display: "none !important",
      },
      "body > section#printables": {
        display: "block !important",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "50px",
        margin: "2cm",
      },
      "@page": {
        margin: "0cm",
        size: "A4",
      },
    },
  });
  return h(Container, {
    id: "printables",
    hidden: true,
    ...props,
  });
}

function Application({ id, ...props }) {
  const Container = useContainer("section", {
    "@media screen": {
      "html, body": {
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
      },
      "body": {
        fontSize: "16px",
        lineHeight: "1.5",
        boxSizing: "border-box",
        overscrollBehavior: "none",
        textRendering: "optimizeLegibility",
        touchAction: "pan-x pan-y !important",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: 0,
        color: "white",
        transition: "background-color 500ms",
        backgroundColor: "#0F172A",
        border: 0,
        outline: 0,
        "&::before": {
          content: '""',
          position: 'fixed',
          inset: 0,
          backgroundImage: [
            "linear-gradient(to bottom, black, transparent)",
            "linear-gradient(to top, black, transparent)",
          ].join(", "),
          backgroundSize: '100% 200px, 100% 200px',
          backgroundPosition: 'top, bottom',
          backgroundRepeat: 'no-repeat',
          height: '100dvh',
          zIndex: -1,
        },
        // Add to your global styleObj
        '&x::after': {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          content: '""',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 3px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 99999
        },
        "section#application": {
          overflow: 'auto',
          overscrollBehavior: 'contain', 
          WebkitOverflowScrolling: "touch",
          display: "grid",
          justifyItems: "center",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "1fr",
          gridColumnGap: "0px",
          gridRowGap: "10px",
          maxHeight: "100dvh",
          maxWidth: "100dvw",
          margin: "auto",
        },
        "button": {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "4px",
          border: "2px solid #4ec9b0",
          borderRadius: "6px",
          padding: "6px 16px",
          fontFamily: "monospace",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#4ec9b0",
          textTransform: "uppercase",
          letterSpacing: "1px",
          cursor: "pointer",
          backgroundColor: "#0c0d11",
          backgroundImage: "linear-gradient(rgb(255,255,255,0.25) 15%, transparent 40%)",
          boxShadow: "0 0 12px rgb(10, 10, 10)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#4ec9b0",
            backgroundImage: "linear-gradient(rgb(0,0,0,0.25) 15%, transparent 40%)",
            //boxShadow: "0 0 10px rgba(78, 201, 176, 0.5)", // Subtle cyan glow
            //textShadow: "-4px 0 10px black, 4px 0 10px black",
            //color: "#1e1e1e",
            color: "black",
          },
        },
        "*": {
          "-webkit-tap-highlight-color": "transparent",
          tapHighlightColor: "transparent",
          //overscrollBehavior: "none",
          boxSizing: "border-box",
        },
      },
    },
  });
  return h(Container, {
    id: "application",
    hidden: false,
    ...props,
  });
}

function Title({ ...props }) {
  const Div = useContainer("div", {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "75px auto 75px",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "calc(190px * 3)",
    width: "calc(100% - 20px)",
    background: "unset",
    margin: "auto",
    img: {
      background: "unset",
      height: "75px",
      width: "75px",
    },
    h1: {
      background: "unset",
      textShadow: "0 2px 2px black",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      color: "white",
      fontSize: "30px",
      margin: "unset",
    },
  });
  return h(Div, null, [
    h("img", { src: "favicon.svg" }),
    h("h1", null, props.title || "No Title"),
    h("img", { src: "favicon.svg" }),
  ]);
}

function Navigate({ children, ...props }) {
  const Nav = useContainer("nav", {
    display: "grid",
    gridTemplateRows: "55px",
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "calc(100% - 10px)",
    maxWidth: "calc(176px * 3)",
    borderRadius: "6px",
    margin: "auto",
  });
  return h(Nav, null, [
    children,
  ]);
}

function Content({ ...props }) {
  const [content, setContent] = useState(null);
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  useEventListener(async function () {
    const hash = (window.location.hash || "#!/home");
    const request = new Object({ path: [], params: {} });
    const segments = hash.split("/").slice(1).filter(Boolean);
    for (const segment of segments) {
      try {
        const decoded = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
        Object.assign(request.params, JSON.parse(decoded));
        break; // Stop Segment Checks
      } catch (e) {
        request.path.push(segment);
        continue;
      }
    }
    if (request instanceof Object) {
      //console.log("PageRequest:", request);
      if (true) setContent(h(Loader, null));
      request.path = `/pages/${request.path.join("/")}.js`;
      Promise.all([ import(request.path), sleep(500) ]).then(function([module]){
        if (hash !== window.location.hash) return false;
        setContent(h(module.default, { request }));
      });
    }
  }, {
    parentEvent: "hashchange",
    parentElement: window,
    runOnMount: true,
  });
  return h(Fragment, null, [
    content || null,
  ]);
};
  
  function Notification({ ...props }){
    const [toasts, setToasts] = useState(null);
    
    /*
  useEffect(function () {
    const ctrl = new AbortController();
    const options = { signal: ctrl.signal };
    const eventSource = new EventSource("https://ntfy.sh/7c1cfdb6-96e6-4367-bd88-133c72f4ae2a/sse");

    eventSource.addEventListener("error", function (event) {
      if (event.preventDefault) event.preventDefault();
      console.log("listener", event);
    }, options);
    
    eventSource.addEventListener("message", function ({ data, ...event }) {
      const { tags, title, message, ...props } = JSON.parse(data);
      if (tags && tags[0] == "vertical_traffic_light") return;
      console.log(props);
      setToasts(message);
    }, options);

    return function () {
      eventSource.close();
      ctrl.abort();
    };
  }, []);
  /**/

    return h("div", {
      children: toasts,
    });
  };


function Header({ ...props }) {
  const animationRef = useRef({ el:null });
  const Container = useContainer("header", {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "80px 65px",
    background: "hsl(261, 52%, 45%)",
    backgroundImage: [
      "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
      "linear-gradient(135deg, rgba(69,202,255,1) 0%, rgba(181,61,254,1) 40%, rgba(181,61,254,1) 60%, rgba(103,58,184,1) 100%)",
    ],
    backgroundAttachment: ["fixed", "scroll"],
    backgroundSize: ["auto 40px", "auto"],
    backgroundRepeat: "no-repeat",
    boxShadow: "0 0 6px rgb(10, 10, 10)",
    borderRadius: "0 0 12px 12px",
    top: "calc(-80px)",
    right: "5px",
    left: "5px",
    userSelect: "none",
    position: "sticky",
    maxWidth: "calc(800px - 10px)",
    width: "calc(100dvw - 10px)",
    margin: "auto",
    zIndex: 10000,
    animation: "showHeader 1000ms",
    "@keyframes showHeader": {
      from:{ position:"relative", left:0, top:"-100%" },
      to:{ position:"relative", left:0, top:"0px" }
    }
  });
  return h(Container, { ref: animationRef, ...props }, [
    h(Title, { title: "My Stuff & Things!" }),
    h(Navigate, null, [
      h("button", { href: createLink("home") }, "🏠 Home"),
      h("button", { href: createLink("aboutme") }, "👨‍💻 about_me"),
      h("button", { href: createLink("projects") }, "🚧 projects"),
    ]),
  ]);
};

function Main({ ...props }) {
  const animationRef = useRef(null);
  const Container = useContainer("main", {
    display: "grid",
    maxWidth: "calc(800px - 20px)",
    width: "calc(100dvw - 20px)",
    height: "fit-content",
    paddingBottom: "48px",
    margin: "auto",
    gap: "10px",
    animation: "showMain 1000ms",
    "@keyframes showMain": {
      from:{ position:"relative", left:0, top:"-100%", opacity:0 },
      to:{ position:"relative", left:0, top:"0px", opacity:1 }
    },
    "article": {
      display: "grid",
      overflow: "hidden",
      borderRadius: "12px",
      gap: "4px",
      border: "4px solid transparent",
      boxShadow: "0 0 6px rgb(10, 10, 10)",
      backgroundImage: "linear-gradient(135deg, rgba(69,202,255,1) 0%, rgba(181,61,254,1) 40%, rgba(181,61,254,1) 60%, rgba(103,58,184,1) 100%)",
      backgroundOrigin: "border-box",
      backgroundClip: "border-box",
      "&.green": {
        backgroundImage: "linear-gradient(135deg, #32CD32 0%, #2E8B57 50%, #006400 100%) !important",
      },
      "&.blue": {
        backgroundImage: "linear-gradient(135deg, #00BFFF 0%, #4169E1 50%, #0000CD 100%) !important",
      },
      "&.red": {
        backgroundImage: "linear-gradient(135deg, orange 0%, tomato 50%, red 100%) !important",
      },
      "p": {
        "&:first-child": {
          marginTop: "unset",
        },
        "&:last-child": {
          marginBottom: "unset",
        },
      },
      "& > *.header": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundImage: "linear-gradient(rgb(48, 48, 48) 13%, rgb(30, 30, 30) 40%, #0c0d11 86%)",
        minHeight: "40px",
      },
      "& > *.footer": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        minHeight: "40px",
      },
      "& > *": {
        display: "inherit",
        background: "#161b22",
        padding: "0.25rem 0.75rem",
        borderRadius: "4px",
        overflow: "hidden",
      }
    }
  });
  useEventListener(function (event) {
    const applicationURL = new URL(window.location.href);
    if (event.target.hasAttribute("href")) {
      if (!event.target.getAttribute("href").startsWith("http")) {
        if (typeof event.preventDefault == "function") event.preventDefault();
        window.location = event.target.getAttribute("href");
      }
      if ("vibrate" in navigator && true) {
        navigator.vibrate(5);
      }
    }
  }, {
    parentElement: document,
    parentEvent: "click",
  });
  return h(Container, { ref: animationRef, style:{}, ...props }, [
    h(ErrorHandler, { id: "error-handler" }, [
      h(Content),
    ]),
  ]);
};

/**
 * Application Entry Point
 * 1. Resolves the root element and clears existing HTML to prevent UI ghosting.
 * 2. Enforces a default '/#!/home' route via history.replaceState if the hash is empty.
 * 3. Mounts the high-level Fragment containing the 'Printables' layer (for document generation)
 * and the 'Application' core (containing the 'AppInit' logic).
 */
export default function renderApp() {
  const root = document.body || document.getElementById("app", true);
  if (root && root.innerHTML) root.innerHTML = "";
  if (location.hash === "") history.replaceState(null, "", "/#!/home");
  return render(h(Fragment, null, [
    h(Printables, null, [
      h("img", { src: "./images/printer.svg", width: "200px" }),
      h("h1", null, "Nothing To Print"),
      h("p", null, "Sorry..."),
    ]),
    h(Application, { id:"app-application" }, [
      h(Header, { id:"app-header" }),
      h(Main, { id:"app-main" }),
    ]),
  ]), root);
}