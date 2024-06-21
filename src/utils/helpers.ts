export const extractArrayFromContent = (content: string) => {
  // Find all arrays in the content
  const matches: any = content.matchAll(/\[(.*?)\]/g);
  let lastArray = [];
  let textWithoutArray = content;
  // Iterate through matches to find the last array and remove arrays from text
  for (const match of matches) {
    const array = match[1]
      .split(",")
      .map((item: any) => item.trim().replace(/"/g, ""));
    lastArray = array; // Update lastArray for each match, eventually keeping the last one found
    textWithoutArray = textWithoutArray.replace(match[0], ""); // Remove the current array from the text
  }
  // Trim the text without arrays to remove leading/trailing whitespace
  textWithoutArray = textWithoutArray.trim();

  return {
    array: lastArray,
    textWithoutArray: textWithoutArray,
  };
};
export const findTransactions = (array: any, data: any) => {
  return data.filter((item: any) => array.includes(item.id));
};
