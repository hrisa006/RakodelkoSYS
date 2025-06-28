import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import PDFDocument from "pdfkit";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";
import Item from "../models/itemModel";
import User from "../models/userModel";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const getInvoice = async (req: AuthenticatedRequest, res: Response) => {
  const userId = (req.user as JwtPayload)?.id;
  const orderId = Number(req.params.orderId);

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          include: [Item],
        },
      ],
    });

    if (!order) {
      res.status(404).send("Order not found");
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("RakodelkoSYS - Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${order.id}`, 50, doc.y + 50);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Customer: ${user.username}`);
    doc.moveDown();

    doc.font("Helvetica-Bold");
    doc.text("Item", 50, doc.y + 20, { width: 200 });
    doc.text("Quantity", 330, doc.y - 14, { width: 80, align: "left" });
    doc.text("Price", 430, doc.y - 14, { width: 80, align: "left" });
    doc.text("Total", 520, doc.y - 14, { width: 80, align: "left" });
    doc.moveDown();
    doc.font("Helvetica");

    order.OrderItems.forEach(
      (oi: {
        price: string | number;
        quantity: number;
        Item: { title: string };
      }) => {
        const priceNum = Number(oi.price);
        const total = priceNum * oi.quantity;

        doc.text(oi.Item?.title || "Item", 50, doc.y, { width: 200 });
        doc.text(String(oi.quantity), 330, doc.y - 15, {
          width: 80,
          align: "left",
        });
        doc.text(priceNum.toFixed(2), 430, doc.y - 14, {
          width: 80,
          align: "left",
        });
        doc.text(total.toFixed(2), 520, doc.y - 14, {
          width: 80,
          align: "left",
        });
        doc.moveDown();
      }
    );

    doc.font("Helvetica-Bold");
    doc.text("Total:", 430, doc.y + 50, { width: 80, align: "left" });
    doc.text(Number(order.totalPrice).toFixed(2), 520, doc.y - 14, {
      width: 80,
      align: "left",
    });

    doc
      .fontSize(10)
      .text(
        "Thank you for shopping with RakodelkoSYS! We expect you soon :)",
        50,
        doc.y + 40,
        { width: 220, align: "left" }
      );

    doc.end();
  } catch (error) {
    console.error("[getInvoice] Error:", error);
    if (!res.headersSent) {
      res.status(500).send("Server error");
    }
  }
};
