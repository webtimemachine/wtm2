/**
 * Return html content from a HTMLElement
 *
 * @param {string} selector
 * @returns {string}
 */
export const DOMtoString = (selector: string): string => {
  const removeAllAttributes = (node: HTMLElement): void => {
    while (node.attributes.length > 0) {
      node.removeAttribute(node.attributes[0].name);
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i] as HTMLElement;
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        removeAllAttributes(childNode);
      }
    }
  };

  let selectedNode: HTMLElement | null = null;

  if (selector) {
    selectedNode = document
      .querySelector(selector)
      ?.cloneNode(true) as HTMLElement;

    if (!selectedNode) {
      return 'ERROR: querySelector failed to find node';
    }

    const styleNodes = selectedNode.querySelectorAll('style');
    const scriptNodes = selectedNode.querySelectorAll('script');
    const linkNodes = selectedNode.querySelectorAll('link');

    styleNodes.forEach((styleNode) => {
      styleNode.parentNode?.removeChild(styleNode);
    });
    scriptNodes.forEach((scriptNode) => {
      scriptNode.parentNode?.removeChild(scriptNode);
    });
    linkNodes.forEach((linkNode) => {
      linkNode.parentNode?.removeChild(linkNode);
    });
  } else {
    selectedNode = document.documentElement;
  }

  if (selectedNode) {
    removeAllAttributes(selectedNode);
    return selectedNode.outerHTML;
  } else {
    return '';
  }
};
