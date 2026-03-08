"use client";

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ExportButtons() {
  const handleExportPNG = async () => {
    const element = document.getElementById("registry");
    if (!element) return;
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "VVS_Registry.png";
    link.click();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("registry");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("VVS_Registry.pdf");
  };

  return (
    <div className="flex gap-2 mb-4">
      <button className="bg-gray-700 text-white p-2 rounded" onClick={handleExportPNG}>
        Export PNG
      </button>
      <button className="bg-gray-700 text-white p-2 rounded" onClick={handleExportPDF}>
        Export PDF
      </button>
    </div>
  );
}