"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

const ImageToPDFConverter: React.FC = () => {
  const [pdfName, setPdfName] = useState<string>("document.pdf");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const readImageAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const generatePDF = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setLoading(true);

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
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      
      {/* Main Card */}
      <div className="backdrop-blur-xl bg-white/20 shadow-xl w-full max-w-xl p-8 rounded-3xl border border-white/30">
        
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          Image → PDF Converter
        </h1>

        {/* Upload Box */}
        <label className="block w-full p-6 border-2 border-dashed border-white/50 rounded-2xl cursor-pointer bg-white/10 text-center text-white hover:bg-white/20 transition-all">
          <span className="text-lg">Click or Drag Images Here</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        {/* File Preview Grid */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="w-full h-24 bg-white/20 rounded-xl overflow-hidden shadow-md border border-white/20"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* PDF Name Input */}
        <input
          type="text"
          placeholder="Enter PDF Name"
          value={pdfName}
          onChange={(e) => setPdfName(e.target.value)}
          className="w-full mt-5 p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:ring-2 focus:ring-white outline-none"
        />

        {/* Convert Button */}
        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full mt-5 py-3 text-xl font-semibold rounded-xl bg-white text-indigo-700 hover:bg-white/80 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Converting..." : "Convert to PDF"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToPDFConverter;
