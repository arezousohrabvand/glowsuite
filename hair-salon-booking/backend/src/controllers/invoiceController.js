import PDFDocument from "pdfkit";
import Billing from "../models/Billing.js";

export const downloadInvoice = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (String(bill.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${bill.invoiceNumber}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // HEADER
    doc.fontSize(20).text("GlowSuite Invoice", { align: "center" });
    doc.moveDown();

    // INFO
    doc.fontSize(12);
    doc.text(`Invoice #: ${bill.invoiceNumber}`);
    doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`);
    doc.text(`Status: ${bill.paymentStatus}`);
    doc.moveDown();

    // DETAILS
    doc.text(`Service: ${bill.title}`);
    doc.moveDown();

    doc.text(`Subtotal: $${bill.subtotal}`);
    doc.text(`Tax: $${bill.taxAmount}`);
    doc.text(`Discount: -$${bill.discountAmount}`);
    doc.text(`Total: $${bill.total}`);
    doc.moveDown();

    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
