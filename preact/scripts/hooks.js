import { h, useRef, useMemo, useState, useEffect, useLayoutEffect, useCallback, useErrorBoundary } from "./provider.js";
//import { h, setup, prefix, css, glob } from "./provider.js";
import { toHash, toCSS } from "./utilities.js"; 
      
//setup(h, prefix);
      
export function useEventListener(func, setup) {
  /**
   * Attaches a managed event listener to a target element with an optional immediate execution.
   * @param {Function} func - (event) => void
   * @param {Object} setup - { parentElement: Element|Window, parentEvent: string, runOnMount: boolean }
  **/
  const callback = useCallback(func, []);
  const { parentElement, parentEvent, runOnMount } = setup;
  useEffect(function() {
    const ctrl = new AbortController();
    if (runOnMount === true) callback(null);
    parentElement.addEventListener(parentEvent, callback, {
      signal: ctrl.signal,
    });
    return function() {
      ctrl.abort();
    };
  }, [
    parentElement,
    parentEvent,
    runOnMount,
    callback,
  ]);
};

export function useNetworkStatus() {
  /**
   * Tracks the browser's connectivity status in real-time.
   * @returns {boolean} - True if the browser is online, false otherwise.
  **/
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(function(){
    const ctrl = new AbortController();
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus, { signal: ctrl.signal });
    window.addEventListener("offline", updateStatus, { signal: ctrl.signal });
    return function() {
      ctrl.abort();
    }
  }, []);
  return isOnline;
};

export function useContainer(tagName, styleObj) {
  /**
   * Creates a function component with scoped styles using `adoptedStyleSheets`.
   * @param {string} [tagName="div"] - The HTML tag to render for the container.
   * @param {Object|null} [styleObj=null] - A JavaScript object representing the CSS rules.
   * @returns {Function} A functional component (`Container`)
  **/
  if (typeof tagName != "string") throw "useContainer: tagName must be a string.";
  if (typeof styleObj != "object") throw "useContainer: styleObj must be an object.";
  const { styleHash, styleOutput } = useMemo(function() {
    const styleHash = `elem-${crypto.getRandomValues(new Uint32Array(1))[0]}`;
    const styleOutput = toCSS(styleObj || {}, "." + styleHash);
    //console.debug(`Container: ${tagName};`, styleOutput);
    return { styleHash, styleOutput };
  }, []);
  useLayoutEffect(function(){
    const sheet = new CSSStyleSheet();
    const store = document.adoptedStyleSheets;
    document.adoptedStyleSheets = [...store, sheet];
    sheet.replaceSync(styleOutput); sheet.class = styleHash;
    return function(){
      const store = document.adoptedStyleSheets;
      document.adoptedStyleSheets = store.filter(function(item) {
        if (item == sheet) return false;
        return true;
      });
    };
  }, []);
  return function Container({ children, class:cn, ...props }) {
    return h(tagName || "div", { // Apply element props
      class: [cn, styleHash].filter(Boolean).join(" "),
      children: [children, null],
      ...props,
    });
  };
}

export function _useGlobalStyles(style) {
  if (!window.globalStyles) window.globalStyles = {};
  window.globalStyles = Object.assign(window.globalStyles, style);
  return glob(window.globalStyles);
}
export function _useStyles(...args) {
  /**
   * Merges class names and style objects into a single string; requires goober for object parsing.
   * @param {...(string|Object)} args - Class names or style objects.
   * @returns {string} - A goober.js className as a string.
  **/
  return args.filter(Boolean).map(function(data) {
    const isObject = typeof data == "object";
    if (isObject) return css(data);
    return data.toString();
  }).join(" "); 
};

export function useLibrary(url, callback) {
  /**
   * Dynamically imports an external module and executes a callback upon successful load.
   * @param {string} url - The location of the JS library/module.
   * @param {Function} callback - (library) => void
  **/
  const [lib, setLib] = useState(null);
  if (typeof url != "string") throw "useLibrary: url must be a string.";
  if (typeof callback != "function") throw "useLibrary: callback must be a function.";
  useEffect(function() {
    if (!lib) return import(url).then(setLib);
    if (lib) return callback(lib);
    console.log("useLib", lib);
  }, [lib]);
};

export function useObject(initial = {}) {
  /**
   * Creates a reactive state object using a Proxy to handle updates, merges, and resets.
   * @param {Object} initial - The initial state values.
   * @returns {Proxy} - { set: (k,v), merge: (obj), delete: (k), reset: () } & target properties.
  **/
  const [_, setObj] = useState(); // dummy to trigger updates
  const ref = useRef({ ...initial });
  return new Proxy(ref.current, {
    get(target, key) {
      if (key === "set") {
        return (k, v) => {
          target[k] = v;
          setObj({});
        };
      };
      if (key === "merge") {
        return (patch) => {
          Object.assign(target, patch);
          setObj({});
        };
      };
      if (key === "delete") {
        return (k) => {
          delete target[k];
          setObj({});
        };
      };
      if (key === "reset") {
        return () => {
          Object.keys(target).forEach(k => delete target[k]);
          Object.assign(target, initial);
          setObj({});
        };
      };
      return target[key];
    },
  });
};

export function useTimeout(callback, delay = 100) {
  /**
   * Executes a callback function after a specified delay once on mount.
   * @param {Function} callback - () => void
   * @param {number} delay - Time in milliseconds before execution.
  **/
  useEffect(function() {
    const id = setTimeout(callback, delay);
    return function() {
      clearTimeout(id);
    };
  }, []); 
};

export function useInterval(callback, delay = 100) {
  /**
   * Sets up a recurring interval that triggers a callback repeatedly.
   * @param {Function} callback - () => void
   * @param {number} delay - Time in milliseconds between executions.
  **/
  useEffect(function() {
    const id = setInterval(callback, delay);
    return function() {
      clearInterval(id);
    };
  }, []);
};

export function createLink(file, params = null) {
  /**
   * Generates a hash-based URL with optional Base64-encoded parameters.
   * @param {string} file - The target route or file name.
   * @param {Object|null} params - { [key]: value } to be encoded in the URL.
  **/
  const hasData = (params !== null) && (typeof params === 'object');
  const clean = (x) => x.replace(/\+/g, "-").replace(/\//g, "_");
  if (file && !hasData) return `/#!/${file}`; // No Params Set
  const base64 = btoa(JSON.stringify(params));
  return `/#!/${file}/${clean(base64)}`;
};

export function tryCatch(attempt, fail) {
  /**
   * Functional wrapper for try-catch blocks to handle execution safely.
   * @param {Function} attempt - The primary logic to try.
   * @param {Function} fail - Logic to execute if an error occurs.
  **/
  try {
    return attempt ? attempt() : true;
  } catch (error) {
    return fail ? fail() : false;
  }
};

export {
  // Provider Hooks
  useErrorBoundary,
  useLayoutEffect, 
  useCallback,
  useEffect, 
  useState, 
  useMemo,
  useRef,
  h,
}