"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

const ImageToPDFConverter: React.FC = () => {
  const [pdfName, setPdfName] = useState<string>("document.pdf");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const generatePDF = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const pdf = new jsPDF();

    for (const [index, file] of selectedFiles.entries()) {
      const imageData = await readImageAsDataURL(file);
      const img = new Image();
      img.src = imageData;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const width = pdf.internal.pageSize.getWidth();
          const height = (img.height * width) / img.width;

          if (index > 0) pdf.addPage();
          pdf.addImage(img, "PNG", 0, 0, width, height);
          resolve();
        };
      });
    }

    pdf.save(pdfName || "document.pdf");
  };

  const readImageAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Multiple Image to PDF Converter</h1>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="mb-4"
      />
      <input
        type="text"
        placeholder="Enter PDF name (default: document.pdf)"
        value={pdfName}
        onChange={(e) => setPdfName(e.target.value)}
        className="border p-2 mb-4"
      />
      <br />
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Convert to PDF
      </button>
    </div>
  );
};

export default ImageToPDFConverter;
