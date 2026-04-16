import { h, createLink, useContainer } from "/scripts/hooks.js";
import { Fragment } from "/scripts/components.js";

export default function({ request, ...props }) {
  
  const projects = {
    //pokemon: "🔍 Pokémon Lookup",
    //sketch: "🕹️ Spot Drawing",
    //mqtt: "🌍 MQTT",
    //gallery: "🖼️ Image Gallery",
    barcode: "📦 Barcode Scanner",
    clock: "⏰ Current Time",
    space: "🛰️ Space Station",
    weather: "☁️ Weather",
    terminal: "🧑🏻‍💻 Terminal"
  };
  
  const Container = useContainer("aside", {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gap: "inherit",
    "body":{
      backgroundColor: "#2F4F6F",
    },
  });

  const sorted = Object.entries(projects).sort((a, b) => a[0].localeCompare(b[0]));
  return h(Container, null, [
    ...sorted.map(function([project, title]) {
      return h("article", null, [
        h("div", { class:"header" }, title),
        h("div", { class:"footer" }, [
          h("button", {
            href: createLink("projects/" + project),
            children: "Launch 🚀",
          }),
        ]),
      ]);
    }),
  ]);
};