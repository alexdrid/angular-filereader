/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let fileStream = (<File>data).stream()
  let reader = fileStream.getReader()
  processFile(reader)
  // postMessage(response);
});

// addEventListener('ended', ())

let csvData: string = '';
let rowCount: number = 0;
let headers: string[] = [];
let data: string[][] = [];

const processFile = async (reader: ReadableStreamDefaultReader<Uint8Array>)  => {
  

  let result = await reader.read()
    let chunk = new TextDecoder('utf-8').decode(
      result.value || new Uint8Array(),
    )
    let lines = chunk.split('\n')

    for (let i = 0; i < lines.length - 1; i++) {
      csvData += lines[i]
      let line = csvData.trim()
      if (line.endsWith(',')) {
        csvData += '\n'
        continue
      }

      processLine(line)
      csvData = ''
    }

    csvData += lines[lines.length - 1]


    if (!result.done) {
      processFile(reader)
    } else {
      const result = {
        headers: headers,
        values: data
      }
      // console.log(`Finished processing file. Found ${rowCount} rows`)
      postMessage(result)
    }
}

const processLine = (line: string) => {
  rowCount++
  if (!(headers.length > 0)) {
    headers = line
      .replace(/^"|"$/g, '')
      .replace(/^\n|\n$/g, '')
      .split(',')

    return
  }

  const regex = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
  const values = []
  let match

  while ((match = regex.exec(line))) {
    let value = match[2] || match[1] || match[3]
    value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
    values.push(value)
  }

  if (headers.length !== values.length) {
    console.log(
      `Line has ${values.length} values, expected ${headers.length}`,
    )
    return
  }

  data.push(values)

}
