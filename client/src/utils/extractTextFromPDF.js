import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// ✅ IMPORTANT FIX
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
};