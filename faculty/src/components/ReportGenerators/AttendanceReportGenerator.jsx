import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Make sure pdfmake has the font files
pdfMake.vfs = pdfFonts.pdfMake;

const AttendanceReportGenerator = ({ studentList, subjectName }) => {
  const totalStudents = studentList.length;
  const averageAttendance = (
    studentList.reduce(
      (sum, student) => sum + parseInt(student.attendancePercentage),
      0
    ) / totalStudents
  ).toFixed(2);

  const lowAttendance = studentList.reduce(
    (count, student) =>
      parseInt(student.attendancePercentage) < 75 ? count + 1 : count + 0,
    0
  );

  const handleReportGenerate = () => {
    try {
      if (!studentList || studentList.length === 0) {
        alert("No students found");
        return;
      }

      const fonts = {
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
      };

      // Prepare table data with conditional coloring
      const tableData = studentList.map((student) => {
        const attendance = parseInt(student.attendancePercentage);
        const attendanceColor = attendance < 75 ? '#ff4444' : '#333333';
        
        return [
          { text: student.registerNo || "N/A", style: "tableCell" },
          { text: student.studentName || "N/A", style: "tableCell" },
          { text: student.gender || "N/A", style: "tableCell" },
          { text: student.mobileNo || "N/A", style: "tableCell" },
          { text: student.studentYear ? student.studentYear.toUpperCase() : "N/A", style: "tableCell" },
          { 
            text: student.attendancePercentage ? `${attendance}%` : "N/A",
            style: "tableCell",
            color: attendanceColor,
            bold: attendance < 75
          },
        ];
      });

      // Document definition for pdfmake
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          // Header with logo and university info
          {
            columns: [
              {
                width: 'auto',
                text: 'AU',
                style: 'universityLogo'
              },
              {
                width: '*',
                stack: [
                  { 
                    text: 'Anna University Regional Campus Coimbatore', 
                    style: 'header',
                    margin: [0, 5, 0, 0]
                  },
                  { 
                    text: 'Department of Electronics and Communication Engineering', 
                    style: 'department',
                    margin: [0, 5, 0, 0]
                  },
                  { 
                    text: `Subject: ${subjectName}`, 
                    style: 'subject',
                    margin: [0, 5, 0, 0]
                  }
                ]
              }
            ],
            margin: [0, 0, 0, 20]
          },
          
          // Report title and date
          {
            text: 'STUDENT ATTENDANCE REPORT',
            style: 'reportTitle',
            margin: [0, 0, 0, 10]
          },
          {
            text: `Generated on: ${new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}`,
            style: 'date',
            margin: [0, 0, 0, 20]
          },
          
          // Table
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Register No', style: 'tableHeader' },
                  { text: 'Student Name', style: 'tableHeader' },
                  { text: 'Gender', style: 'tableHeader' },
                  { text: 'Mobile No', style: 'tableHeader' },
                  { text: 'Year', style: 'tableHeader' },
                  { text: 'Attendance (%)', style: 'tableHeader' }
                ],
                ...tableData,
              ],
            },
            style: "table",
            layout: {
              fillColor: function (rowIndex) {
                return (rowIndex % 2 === 0) ? '#f5f5f5' : null;
              }
            }
          },

          // Summary Section
          {
            text: 'SUMMARY STATISTICS',
            style: 'summaryTitle',
            margin: [0, 20, 0, 10]
          },
          {
            ul: [
              `Total Students: ${totalStudents}`,
              `Average Attendance: ${averageAttendance}%`,
              {
                text: `Students with <75% Attendance: ${lowAttendance}`,
                color: lowAttendance > 0 ? '#ff4444' : '#333333',
                bold: lowAttendance > 0
              }
            ],
            style: 'summaryList'
          },
          
          // Footer
          {
            text: 'This report is system generated and does not require signature.',
            style: 'footer',
            margin: [0, 30, 0, 0]
          }
        ],

        styles: {
          universityLogo: {
            fontSize: 32,
            bold: true,
            color: '#1a365d',
            alignment: 'center',
            margin: [0, 5, 10, 0]
          },
          header: {
            fontSize: 16,
            bold: true,
            color: '#1a365d'
          },
          department: {
            fontSize: 12,
            color: '#4a5568'
          },
          subject: {
            fontSize: 12,
            bold: true,
            color: '#2d3748'
          },
          reportTitle: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            color: '#2c5282'
          },
          date: {
            fontSize: 10,
            alignment: 'right',
            color: '#718096'
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white',
            fillColor: '#2c5282',
            alignment: 'center'
          },
          tableCell: {
            fontSize: 9,
            margin: [3, 2],
            alignment: 'center'
          },
          table: {
            margin: [0, 10]
          },
          summaryTitle: {
            fontSize: 14,
            bold: true,
            color: '#2c5282'
          },
          summaryList: {
            fontSize: 11,
            color: '#4a5568'
          },
          footer: {
            fontSize: 9,
            italics: true,
            color: '#718096',
            alignment: 'center'
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };

      // Generate the PDF
      pdfMake.fonts = fonts;
      pdfMake.createPdf(docDefinition).download(`Attendance_Report_${subjectName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleReportGenerate}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Generate PDF Report
    </button>
  );
};

export default AttendanceReportGenerator;