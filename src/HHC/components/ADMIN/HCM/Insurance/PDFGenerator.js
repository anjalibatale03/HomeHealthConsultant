import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

const PDFGenerator = (data) => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const topMargin = 50;
    const bottomMargin = 30;
    let yPosition = topMargin;
    let pageNumber = 1;

    // Function to handle page breaks dynamically
    const checkPageBreak = (height) => {
      if (yPosition + height > pageHeight - bottomMargin) {
        doc.addPage();
        pageNumber++;
        yPosition = topMargin;
      }
    };

    // **Header**
    doc.setFont("helvetica", "bold").setFontSize(10);
      doc.text("Date:", 15, yPosition);
      doc.setFont("helvetica", "normal").text(`${data.date}`, 35, yPosition);


      doc.setFont("helvetica", "bold").text("Policy Number:", 150, yPosition);
      doc.setFont("helvetica", "normal").text(`${data.policyNumber}`, 180, yPosition);
      yPosition += 15;
      checkPageBreak(10);

    // **Title**
   
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("To Whomsoever It May Concern", 15, yPosition);
    yPosition += 10;
    checkPageBreak(10);

    // **Certificate Text**
    doc.setFont("helvetica", "normal").setFontSize(12).setLineHeightFactor(1.5);
    const certificateText = `This is to certify that Patient: ${data.patientName}, a known case of Diagnosis: ${data.diagnosis}, was admitted at Hospital: ${data.hospitalName} under the care of Doctor: ${data.doctorName}. After treatment, the patient was discharged with advice to take further necessary treatment.`;
    const splitText = doc.splitTextToSize(certificateText, 180);
    doc.text(splitText, 15, yPosition);
    yPosition += splitText.length * 5 + 10;
    checkPageBreak(splitText.length * 5 + 10);

    // **Service Table**
   doc.setFont("helvetica", "bold").setFontSize(12);
      doc.text(`Patient ${data.patientName} Healthcare attendants at home for the following time period:`, 15, yPosition);
      yPosition += 8;
      checkPageBreak(10);


    // **Table**
    const tableColumn = ["Sr. No", "From Date", "To Date"];
    const tableRows = data.servicePeriods.map((period, index) => [index + 1, period.fromDate, period.toDate]);

    autoTable(doc, {
      startY: yPosition,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;
    checkPageBreak(20);

     // **Additional Text**
      
     doc.setFont("helvetica", "normal").setFontSize(12).setLineHeightFactor(1.5);
     const additionalText = `Professional of Spero Home Healthcare Pvt. Ltd. Above mentioned healthcare services are provided to the patient at home on behalf of ${data.hospitalName} as per the medical advice given by the consultant under whom the patient was hospitalized.`;
     const additionalTextSplit = doc.splitTextToSize(additionalText, 180);
     doc.text(additionalTextSplit, 15, yPosition);
     yPosition += additionalTextSplit.length * 5 + 10;
     checkPageBreak(10);


    const details = [
      ["Total Service Days:", data.totalDays],
      ["Conveyance Charges:", `Rs. ${data.conveyanceCharges}`],
      ["Discount:", `Rs. ${data.discount}`],
      ["Healthcare Attendants:", `Rs. ${data.attendantCharge} x ${data.totalDays}`],
    ];

    const labelX = 15;
    const valueX = pageWidth - 60;
    details.forEach(([label, value]) => {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold").text(label, labelX, yPosition);
      doc.setFont("helvetica", "normal").text(String(value), valueX, yPosition, { align: "right" });
      yPosition += 8;
    });

    checkPageBreak(10);
    doc.setDrawColor(0);
    doc.line(labelX, yPosition, valueX + 20, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "bold").text("Total Amount:", labelX, yPosition);
    doc.setFont("helvetica", "bold").text(`Rs. ${data.totalAmount}`, valueX, yPosition, { align: "right" });
    yPosition += 10;

    checkPageBreak(20);
    yPosition += 20;
    doc.setFont("helvetica", "bold").text("Healthcare Manager", pageWidth - 60, yPosition);

    // // **Page Numbering**
    // const pageCount = doc.internal.getNumberOfPages();
    // for (let i = 1; i <= pageCount; i++) {
    //   doc.setPage(i);
    //   doc.setFontSize(8);
    //   doc.text(`Page ${i} of ${pageCount}`, 15, pageHeight - 2);
    // }


    // **Download the PDF**
    doc.save(`${data.patientName}_Healthcare_Certificate.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export default PDFGenerator;
