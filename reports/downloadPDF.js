const express = require('express');
const bodyParser = require('body-parser');
const { jsPDF } = require('jspdf'); // For generating PDFs
require('jspdf-autotable'); // For adding tables to the PDF
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

const downloadPDF = async (req, res) => {
  try {
      const { reportName, data } = req.body;

      if (!reportName || !data) {
          return res.status(400).json({ message: 'Report name and data are required' });
      }

      const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [297, 210] // A4 size in landscape
      });

      doc.setFont('helvetica', 'normal');

      // Add title
      doc.setFontSize(14);
      doc.text(reportName, 10, 10);

      // Define table headers and data rows
      let headers = [];
      let rows = [];

      switch (reportName) {
          case 'SUBSCRIBER TRANSACTION SUMMARY':
              headers = ['TIMEDATE', 'MSISDN', 'OPENINGBALANCE', 'TOTALDEBIT', 'TOTALCREDIT', 'CLOSINGBALANCE', 'TOTALBONUS', 'TOTALCASHSEND', 'TOTALCASHRECEIVE', 'ALLOCTRANS', 'TOTALALLOC', 'DEALLOCTRANS', 'TOTALDEALLOC', 'OTHERSPAYMENT', 'AIRTTRANS', 'TOTALAIRT', 'BONUSBALANCEBEFORE', 'BONUSBALANCEAFTER'];
              rows = data.map(item => [item.TIMEDATE, item.MSISDN, item.OPENINGBALANCE, item.TOTALDEBIT, item.TOTALCREDIT, item.CLOSINGBALANCE, item.TOTALBONUS, item.TOTALCASHSEND, item.TOTALCASHRECEIVE, item.ALLOCTRANS, item.TOTALALLOC, item.DEALLOCTRANS, item.TOTALDEALLOC, item.OTHERSPAYMENT, item.AIRTTRANS, item.TOTALAIRT, item.BONUSBALANCEBEFORE, item.BONUSBALANCEAFTER]);
              break;
          case 'SUBSCRIBER TRANSACTION REPORTS':
              headers = ['ID', 'REFERENCEID', 'TYPE', 'FRMSISDN', 'TOMSISDN', 'AMOUNT', 'ORIGBALANCEBEFORE', 'ORIGBALANCEAFTER', 'DESTBALANCEBEFORE', 'DESTBALANCEAFTER', 'TIMESTAMP', 'DETAILTYPE', 'EXTENDEDDATA', 'STATUS', 'REMARKS', 'COMMISSION'];
              rows = data.map(item => [item.ID, item.REFERENCEID, item.TYPE, item.FRMSISDN, item.TOMSISDN, item.AMOUNT, item.ORIGBALANCEBEFORE, item.ORIGBALANCEAFTER, item.DESTBALANCEBEFORE, item.DESTBALANCEAFTER, item.TIMESTAMP, item.DETAILTYPE, item.EXTENDEDDATA, item.STATUS, item.REMARKS, item.COMMISSION]);
              break;
          case 'SUBSCRIBER BONUS COMMISSION':
              headers = ['TIMESTAMP', 'REFERENCEID', 'FRMSISDN', 'TOMSISDN', 'TYPE', 'AMOUNT', 'COMMISSIONAMOUNT', 'COMMISSIONBALANCEBEFORE', 'COMMISSIONBALANCEAFTER'];
              rows = data.map(item => [item.TIMESTAMP, item.REFERENCEID, item.FRMSISDN, item.TOMSISDN, item.TYPE, item.AMOUNT, item.COMMISSIONAMOUNT, item.COMMISSIONBALANCEBEFORE, item.COMMISSIONBALANCEAFTER]);
              break;
          case 'SUBSCRIBER ACCOUNT SUMMARY':
              headers = ['ACCOUNTID', 'ACCOUNTTYPE', 'NICKNAME', 'FIRSTNAME', 'LASTNAME', 'MSISDN', 'CURRENTAMOUNT', 'STATUS', 'SRET'];
              rows = data.map(item => [item.ID, item.ACCOUNTTYPE, item.NICKNAME, item.FIRSTNAME, item.LASTNAME, item.MSISDN, item.CURRENTAMOUNT, item.STATUS, item.SRET]);
              break;
          case 'SUBSCRIBER TRANSACTION STATEMENT':
              headers = ['REFERENCEID', 'TIMESTAMP', 'TYPE', 'MSISDN', 'ALIAS', 'CREDIT', 'DEBIT', 'AMOUNT', 'BALANCEBEFORE', 'BALANCEAFTER', 'EXTENDEDDATA', 'REMARKS', 'CURRENCYTYPE'];
              rows = data.map(item => [item.REFERENCEID, item.TIMESTAMP, item.TYPE, item.MSISDN, item.ALIAS, item.CREDIT, item.DEBIT, item.AMOUNT, item.BALANCEBEFORE, item.BALANCEAFTER, item.EXTENDEDDATA, item.REMARKS, item.CURRENCYTYPE]);
              break;
          default:
              headers = [];
              rows = [];
      }

      // Add table to the PDF
      doc.autoTable({
          head: [headers],
          body: rows,
          startY: 20,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10, cellPadding: 3 },
          margin: { top: 30 }
      });

      const pdfBuffer = doc.output('arraybuffer');
      res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.byteLength,
      });
      res.send(Buffer.from(pdfBuffer));
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating PDF' });
  }
};

module.exports = downloadPDF;