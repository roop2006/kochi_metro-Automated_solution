import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, insertWorkflowItemSchema, insertQrCodeSchema } from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      const statsMap: Record<string, number> = {};
      stats.forEach(stat => {
        statsMap[stat.metric] = parseInt(stat.value, 10);
      });
      res.json(statsMap);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Simulate AI processing with realistic classifications
      const classifications = [
        {
          classification: 'Maintenance Report',
          summary: `${file.originalname} - Weekly brake system inspection completed successfully for Train Car 205`,
          department: 'Maintenance Department',
          type: 'maintenance'
        },
        {
          classification: 'Safety Circular',
          summary: `${file.originalname} - Updated platform safety guidelines and emergency procedures`,
          department: 'Safety Department',
          type: 'safety'
        },
        {
          classification: 'Vendor Invoice',
          summary: `${file.originalname} - Track supplies and materials procurement invoice for Q1 2025`,
          department: 'Finance Department',
          type: 'finance'
        },
        {
          classification: 'Training Manual',
          summary: `${file.originalname} - Staff training documentation for operational procedures`,
          department: 'HR Department',
          type: 'hr'
        }
      ];

      const randomClassification = classifications[Math.floor(Math.random() * classifications.length)];
      
      const documentData = {
        title: randomClassification.classification + ' - ' + file.originalname,
        department: randomClassification.department,
        type: randomClassification.type,
        summary: randomClassification.summary,
        content: `Uploaded file: ${file.originalname} (${file.size} bytes)`,
        status: 'active'
      };

      const validatedData = insertDocumentSchema.parse(documentData);
      const document = await storage.createDocument(validatedData);
      
      res.json({
        document,
        processing: {
          classification: randomClassification.classification,
          summary: randomClassification.summary,
          department: randomClassification.department
        }
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Search documents
  app.get("/api/documents/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      const results = await storage.searchDocuments(
        q as string || '', 
        type as string
      );
      res.json(results);
    } catch (error) {
      console.error('Error searching documents:', error);
      res.status(500).json({ error: "Failed to search documents" });
    }
  });

  // Workflow routes
  app.get("/api/workflow", async (req, res) => {
    try {
      const items = await storage.getWorkflowItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching workflow items:', error);
      res.status(500).json({ error: "Failed to fetch workflow items" });
    }
  });

  app.post("/api/workflow", async (req, res) => {
    try {
      const validatedData = insertWorkflowItemSchema.parse(req.body);
      const item = await storage.createWorkflowItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error('Error creating workflow item:', error);
      res.status(500).json({ error: "Failed to create workflow item" });
    }
  });

  app.patch("/api/workflow/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const item = await storage.updateWorkflowItem(id, updates);
      
      if (!item) {
        return res.status(404).json({ error: "Workflow item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error updating workflow item:', error);
      res.status(500).json({ error: "Failed to update workflow item" });
    }
  });

  // QR Code routes
  app.get("/api/qr-codes", async (req, res) => {
    try {
      const qrCodes = await storage.getQrCodes();
      res.json(qrCodes);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      res.status(500).json({ error: "Failed to fetch QR codes" });
    }
  });

  app.get("/api/qr-codes/:code", async (req, res) => {
    try {
      const qrCode = await storage.getQrCodeByCode(req.params.code);
      if (!qrCode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      res.json(qrCode);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      res.status(500).json({ error: "Failed to fetch QR code" });
    }
  });

  app.post("/api/qr-codes", async (req, res) => {
    try {
      const validatedData = insertQrCodeSchema.parse(req.body);
      const qrCode = await storage.createQrCode(validatedData);
      res.json(qrCode);
    } catch (error) {
      console.error('Error creating QR code:', error);
      res.status(500).json({ error: "Failed to create QR code" });
    }
  });

  app.patch("/api/qr-codes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const qrCode = await storage.updateQrCode(id, updates);
      
      if (!qrCode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      
      res.json(qrCode);
    } catch (error) {
      console.error('Error updating QR code:', error);
      res.status(500).json({ error: "Failed to update QR code" });
    }
  });

  // Simulate QR scan endpoint
  app.post("/api/qr-scan/simulate", async (req, res) => {
    try {
      const qrCodes = await storage.getQrCodes();
      const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)];
      
      if (!randomQR) {
        return res.status(404).json({ error: "No QR codes available" });
      }
      
      res.json({
        documentId: randomQR.code,
        title: randomQR.title,
        equipment: randomQR.equipment,
        status: randomQR.status,
        description: randomQR.description
      });
    } catch (error) {
      console.error('Error simulating QR scan:', error);
      res.status(500).json({ error: "Failed to simulate QR scan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
