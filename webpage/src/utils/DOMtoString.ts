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
    const imgNodes = selectedNode.querySelectorAll('img');
    const anchors = selectedNode.querySelectorAll('a');

    styleNodes.forEach((styleNode) => {
      styleNode.parentNode?.removeChild(styleNode);
    });
    scriptNodes.forEach((scriptNode) => {
      scriptNode.parentNode?.removeChild(scriptNode);
    });
    linkNodes.forEach((linkNode) => {
      linkNode.parentNode?.removeChild(linkNode);
    });
    // images are removed here to avoid huge returned content due to base64 encoding
    imgNodes.forEach((imgNode) => {
      imgNode.parentNode?.removeChild(imgNode);
    });
    // sites' links have no relevant content
    anchors.forEach((anchor) => {
      anchor.parentNode?.removeChild(anchor);
    });
    // Generally, the header and footer nodes contain presentation data, not the main content itself
    const header = selectedNode.querySelector('header');
    if (header) {
      header.parentNode?.removeChild(header);
    }
    const footer = selectedNode.querySelector('footer');
    if (footer) {
      footer.parentNode?.removeChild(footer);
    }
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


/**
 * Return the sources of existing images that meet the size threshold
 *
 * Note that sources can be HTTP URLs or base64 encoded images
 * @returns {string[]}
 */
export const getImages = (): string[] => Array.from(document.querySelectorAll('img'))
  .filter(img => img.height > 500)
  .map(img => img.src);