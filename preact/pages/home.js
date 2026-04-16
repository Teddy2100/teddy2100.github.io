import { useRef, useEffect, useLayoutEffect, useState } from "/scripts/hooks.js";
import { createLink, useObject, useTimeout, useContainer } from "/scripts/hooks.js";
import { Fragment, Article, Dock, Sketch } from "/scripts/components.js";
import { h, LoremIpsum } from "/scripts/provider.js";

function randomColor() {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const h = randomInt(0, 360), s = randomInt(42, 98), l = randomInt(40, 90);
  return `hsl(${h},${s}%,${l}%)`;
};
  
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 8,
    min: 4
  }
});
  
export default function({ request, ...props }) {
  const href = createLink("home", { words: lorem.generateWords(1) });
  
  return h(Fragment, null, [
    h("article", { class: "blue" }, [
      h("div", { class:"header" }, "🧪 Welcome.."),
      h("div", { class:"body" }, [
        h("button", { href }, href),
        h("pre", null, JSON.stringify(request, null, 2)),
      ]),
      h("div", { class:"footer" }, [
        h("button", { 
          href: createLink("gallery/viewer", ["img1.jpg", "img2.jpg"]),
          children: "Open_Gallery_Array",
        }),
        h("button", {
          href: createLink("template"),
          children: "Page_Template",
        }),
      ]),
    ]),
    /*
    h(Sketch, {
      project: function(p){
        console.log("p5 setup", p);
      },
    }),
    /**/
    h("article", { class:"green" }, [
      h("div", { class:"header" }, "💬 Lorem Ipsum"),
      h("div", { class:"body" }, [
        h("p", null, lorem.generateParagraphs(1)),
        h("p", null, lorem.generateParagraphs(1)),
        h("p", null, lorem.generateParagraphs(1)),
      ]),
    ]),
    h("article", { class:"red" }, [
      h("div", { class:"header" }, "🖨️ Printer Override"),
      h("div", { class:"footer" }, [
        h("button", { onClick: window.print }, "🖨️ Print_page")
      ]),
    ]),
  ]);
};