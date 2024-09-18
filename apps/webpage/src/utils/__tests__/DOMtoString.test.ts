import { DOMtoString, getImages } from '../DOMtoString';

describe('DOMtoString', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Clear the document body before each test
  });

  it('should convert a given HTML element to string without attributes, styles, scripts, and links', () => {
    document.body.innerHTML = `<div id="test"><style>body { color: red; }</style><script>alert('Hello');</script><a href="#">Link</a><p class="paragraph" style="font-weight: bold;">Paragraph</p></div>`;

    const result = DOMtoString('#test');
    const expected = '<div><p>Paragraph</p></div>';
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

describe('getImages', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Clear the document body before each test
  });

  it('should get valid images', () => {
    const expected = [
      'https://media.image.com/test/1',
      'https://media.image.com/test/2',
    ];
    document.body.innerHTML = `
    <div>
      <img src="https://media.image.com/test/1" height="1080" width="1920" loading="lazy">
      <img src="https://media.image.com/test/2" height="1000" width="1920" loading="lazy">
      <img src="https://media.image.com/test/3" height="250" width="300" loading="lazy">
    </div>`;

    const result = getImages();
    expect(result).toEqual(expected);
  });
});
