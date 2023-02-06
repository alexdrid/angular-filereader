/// <reference lib="webworker" />

let headers: string[] = [];
const values: string[][] = [];

let brokenLine = '';
let tempLine = '';

addEventListener('message', ({ data }) => {
  readFile(data as File);
});

const readFile = async (file: File) => {
  const fileStream = (file).stream();
  const readerResult = fileStream.getReader();

  let exhausted = false;


  while (!exhausted) {
    const { value, done } = await readerResult.read();

    const chunk = new TextDecoder('utf-8').decode(
      value || new Uint8Array(),
    );

    const lines = chunk.split('\n');

    lines.forEach((line) => {
      // const data = brokenLine ? brokenLine + line : line
      if (brokenLine) {
        tempLine = brokenLine + line
        brokenLine = ''
        processLine(tempLine.trim());
      } else {
        processLine(line.trim());
      }
    })

    exhausted = done;
  }

  postMessage({
    headers: headers,
    values: values
  });
};

const processLine = (line: string) => {
  const reg = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  const tempFields = line.split(reg).map((s: string) => s.replace(/['"]+/g, '').trim());

  if (!(headers.length > 0)) {
    headers = tempFields
    return;
  }

  if (headers.length !== tempFields.length) {
    brokenLine = line
  } else {
    values.push(tempFields);
  }

};
