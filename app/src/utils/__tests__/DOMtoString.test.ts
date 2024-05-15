import { DOMtoString } from '../DOMtoString';

describe('DOMtoString', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Clear the document body before each test
  });

  it('should convert a given HTML element to string without attributes, styles, scripts, and links', () => {
    document.body.innerHTML = `<div id="test"><style>body { color: red; }</style><script>alert('Hello');</script><a href="#">Link</a><p class="paragraph" style="font-weight: bold;">Paragraph</p></div>`;

    const result = DOMtoString('#test');
    const expected = '<div><a>Link</a><p>Paragraph</p></div>';
    expect(result.trim()).toEqual(expected);
  });

  it('should convert the entire document to string without attributes, styles, scripts, and links if no selector is provided', () => {
    document.body.innerHTML = `<style>body { color: red; }</style><script>alert('Hello');</script><a href="#">Link</a><p class="paragraph" style="font-weight: bold;">Paragraph</p>`;

    const result = DOMtoString('');
    const expected =
      "<html><head></head><body><style>body { color: red; }</style><script>alert('Hello');</script><a>Link</a><p>Paragraph</p></body></html>";
    expect(result).toEqual(expected);
  });

  it('should return an error message if the provided selector does not match any element', () => {
    document.body.innerHTML = `
      <div id="test">
        <p>Paragraph</p>
      </div>
    `;

    const result = DOMtoString('#nonexistent');
    const expected = 'ERROR: querySelector failed to find node';
    expect(result).toEqual(expected);
  });
});
