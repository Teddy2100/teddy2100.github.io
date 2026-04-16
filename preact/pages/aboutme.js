import { h, useEffect, useState, createLink, useContainer } from '/scripts/hooks.js';
import { Fragment, Article } from "/scripts/components.js";

export default function({ request, ...props }){
  const Container = useContainer("aside", {
    a: {
      color: "white"
    },
    "div.header": {
      // 2. Display & Box Model
      display: "flex",
      alignItems: "center",
      gap: "16px",
      //marginBottom: "24px",
      "div#status-dot": {
        // 2. Display & Box Model
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        // 4. Visuals
        backgroundColor: "#238636",
        boxShadow: "0 0 10px #238636",
        // 5. Miscellaneous
        animation: "pulse 2s infinite",
      },
      "h2#title": {
        // 3. Typography
        margin: "0",
        color: "#f0f6fc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "1.4rem",
        fontWeight: "600",
      },
    },
    "div.body": {
      // 3. Typography
      //color: "#8b949e",
      fontFamily: "ui-monospace, 'Cascadia Code', monospace",
      fontSize: "0.95rem",
      lineHeight: "1.6",
      padding:"12px",
    },
      "div.hobby-grid": {
        // 2. Display & Box Model
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
      padding:"12px",
      },
      "div.hobby-item": {
        // 2. Display & Box Model
        padding: "12px",
        borderRadius: "6px",
        // 4. Visuals
        backgroundColor: "#0d1117",
        border: "1px solid #444444",
      },
      "span.label": {
        // 3. Typography
        display: "block",
        marginBottom: "4px",
        color: "#58a6ff",
        fontSize: "0.7rem",
        textTransform: "uppercase",
      },
      "span.value": {
        // 3. Typography
        color: "#c9d1d9",
        fontSize: "0.85rem",
      },
    
    "@keyframes pulse": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.4 },
      "100%": { opacity: 1 }
    },
  });

  return h(Container, null, [
    h("article", null, [
      h("div", { class: "header" }, [
        h("h2", { id: "title" }, "Code as a Craft"),
        h("div", { id: "status-dot" }),
      ]),
      h("div", { class: "body" }, [
        h("p", null, "To me, development isn't just a profession—it's a digital workshop. I spend my free time exploring the boundaries of minimalist frameworks, perfecting UI protocols, and building tools that balance efficiency with aesthetic precision."),
      ]),
      h("div", { class:"hobby-grid" }, [
        h("div", { class: "hobby-item" }, [
          h("span", { class: "label" }, "Currently Exploring"),
          h("span", { class: "value" }, "Animation")
        ]),
        h("div", { class: "hobby-item" }, [
          h("span", { class: "label" }, "Loves"),
          h("span", { class: "value" }, "Clean Templates")
        ]),
        h("div", { class: "hobby-item" }, [
          h("span", { class: "label" }, "Philosophy"),
          h("span", { class: "value" }, "Zero Footprint")
        ]),
        h("div", { class: "hobby-item" }, [
          h("span", { class: "label" }, "Build Style"),
          h("span", { class: "value" }, "Functional Components")
        ]),
      ]),
      h("div", { class:"footer" }, [
        h("button", { href:createLink("aboutme/lab") }, "View_My_Hooks"),
        h("button", { href:createLink("aboutme/lab") }, "View_My_Utilities"),
      ]),
    ]),
  ]);
};
