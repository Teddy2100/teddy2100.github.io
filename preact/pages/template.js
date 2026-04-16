import { h, useEffect, useState, useContainer } from '/scripts/hooks.js';
import { Fragment } from "/scripts/components.js";

export default function({ request, ...props }){
  const Container = useContainer("aside", {
    // IMPORTANT: Do not alter height or width of parent.
    // IMPORTANT: Nest all child styles here.
    display: "grid",
    "body":{
      // IMPORTANT: Update color or match content,
      backgroundColor: "#2F4F6F",
    },
  });
  return h(Container, null, [
    // IMPORTANT: Do not add h("main#app-content");
    // IMPORTANT: Content Goes Here.
  ]);
};