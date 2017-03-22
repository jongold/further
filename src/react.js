// @flow
import { createElement, PropTypes } from "react";

import filterProps from "./utils/validAttrs";

const render = function(type = "div") {
  const StyleComponent = ({ children, ...props }, { theme, renderer }) => {
    if (!renderer) {
      const componentName = type.displayName ? type.displayName : type;
      throw new Error(
        `
        render() can't render styles for the component '${componentName}' without a
        Style renderer in the context. Are you missing further's <Provider /> at the app root?
      `
      );
    }

    // pick off props based on renderer type
    const { isNativeRenderer } = renderer;
    // filter based on environment
    let componentProps = {};

    props.theme = theme || {};

    // native support
    if (isNativeRenderer) {
      componentProps = { ...props };
      const style = renderer.renderRule(this.__value, props);
      componentProps.style = props.style ? [style, props.style] : style;
    } else {
      Object.keys(props)
        .filter(propName => typeof type !== "string" || filterProps(propName))
        .forEach(propName => {
          componentProps[propName] = props[propName];
        });
      if (props.style) componentProps.style = props.style;
      const cls = props.className ? `${props.className} ` : "";
      componentProps.className = cls + renderer.renderRule(this.__value, props);
    }

    if (props.id) componentProps.id = props.id;
    componentProps.ref = props.innerRef;

    const customType = props.is || type;
    return createElement(customType, componentProps, children);
  };

  StyleComponent.displayName = this.__name ? this.__name : "StyleComponent";
  StyleComponent.__isStyle = true;

  StyleComponent.contextTypes = {
    renderer: PropTypes.object,
    theme: PropTypes.object,
  };

  StyleComponent.map = f => this.map(f).render(type);
  StyleComponent.concat = f => this.concat(f).render(type);

  return StyleComponent;
};

export default render;
