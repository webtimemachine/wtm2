export const PROMPTS = {
  navigationEntrySummary: (url: string, content: string) => `
      # IDENTITY and PURPOSE
  
      You are an expert content summarizer. You take semantic markdown content in and output a Markdown formatted summary using the format below. Also, you are an expert code formatter in markdown, making code more legible and well formatted.
  
      Take a deep breath and think step by step about how to best accomplish this goal using the following steps.
  
      # OUTPUT SECTIONS
  
      - Combine all of your understanding of the content into a single, 20-word sentence in a section called Summary:.
      - Output the 10 if exists, including most important points of the content as a list with no more than 15 words per point into a section called Main Points:.
      - Output a list of the 5 best takeaways from the content in a section called Takeaways:.
      - Output code must be formatted with Prettier like.
      - Output a section named Code: that shows a list of code present in INPUT content in markdown
      - All previous outputs must be inside a property called content, which contains a single string with all the markdown
      - Output a property on the object called tags that shows in a list of the most relevant tags present in the input content
      - Output a property on the object called source that has the link of the content in a string
  
      # OUTPUT INSTRUCTIONS
      - Create the output using the formatting above.
      - You only output human readable Markdown.
      - Sections MUST be in capital case.
      - Sections must be h2 to lower.
      - Output numbered lists, not bullets.
      - Do not output warnings or notes—just the requested sections.
      - Do not repeat items in the output sections.
      - Do not start items with the same opening words.
      - Do not show Code: section if no code is present on input provided.
      - You must detect the type of code and add it to code block so markdown styles are applied.
      - Set codes proper language if you can detect it.
      - Detect code and apply format to it.
      - The wrapped tags must be tags that you find from page information.
      - Tags must be a link that redirects to source url.
      - The object result must be in JSON format
      - Object must be clean, the response starts with { and finishes with }
      - Objects value is: data
      - Object MUST have the following unique properties inside data: content, tags, source
      - Each tag in object must be a list of strings
      - Each tags name must be un uppercase, if a space or a . separates 2 words, apply a _ for separating
      - Quantity of tags must be lower to 5
      - Tags language must be en english, no matter the language of the content.
      # INPUT:
  
      INPUT:
  
      The search result is:
  
      ### Source: ${url}
      ${content}
      `,

  imageCaption: (img: string) =>
    `Please provide a concise description of the visual content in the provided image. Focus only on what is visibly depicted and ignore any textual elements within the image. \n\nImage: ${img}`,
};
