import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, insertWorkflowItemSchema, insertQrCodeSchema } from "@shared/schema";
import multer from "multer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper functions for AI classification
function extractEquipmentFromFilename(filename: string): string {
  const equipmentPatterns = [
    /train\s*car\s*(\d+)/i,
    /signal\s*system/i,
    /platform\s*safety/i,
    /escalator/i,
    /hvac/i,
    /power\s*supply/i,
    /fire\s*safety/i,
    /track/i,
    /communication/i,
    /ticketing/i
  ];
  
  for (const pattern of equipmentPatterns) {
    const match = filename.match(pattern);
    if (match) return match[0];
  }
  return 'metro equipment';
}

function extractAreaFromFilename(filename: string): string {
  const areaPatterns = [
    /platform/i,
    /station/i,
    /control\s*room/i,
    /depot/i,
    /workshop/i,
    /office/i
  ];
  
  for (const pattern of areaPatterns) {
    if (pattern.test(filename)) return filename.match(pattern)![0];
  }
  return 'operational areas';
}

function extractItemsFromFilename(filename: string): string {
  const itemPatterns = [
    /supplies/i,
    /materials/i,
    /components/i,
    /equipment/i,
    /parts/i,
    /tools/i
  ];
  
  for (const pattern of itemPatterns) {
    if (pattern.test(filename)) return filename.match(pattern)![0];
  }
  return 'operational supplies';
}

function extractSubjectFromFilename(filename: string): string {
  const subjectPatterns = [
    /emergency\s*response/i,
    /safety\s*protocols/i,
    /maintenance\s*procedures/i,
    /operational\s*guidelines/i,
    /training/i
  ];
  
  for (const pattern of subjectPatterns) {
    if (pattern.test(filename)) return filename.match(pattern)![0];
  }
  return 'operational procedures';
}

function extractPeriodFromFilename(filename: string): string {
  const periodPatterns = [
    /q[1-4]\s*202[0-9]/i,
    /january|february|march|april|may|june|july|august|september|october|november|december/i,
    /202[0-9]/i,
    /monthly/i,
    /quarterly/i,
    /annual/i
  ];
  
  for (const pattern of periodPatterns) {
    const match = filename.match(pattern);
    if (match) return match[0];
  }
  return 'current period';
}

function extractScopeFromFilename(filename: string): string {
  const scopePatterns = [
    /safety\s*systems/i,
    /operational\s*procedures/i,
    /infrastructure/i,
    /rolling\s*stock/i,
    /stations/i,
    /maintenance/i
  ];
  
  for (const pattern of scopePatterns) {
    if (pattern.test(filename)) return filename.match(pattern)![0];
  }
  return 'KMRL operations';
}

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

  // Document routes - Note: specific routes must come before parametric routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Search documents - MUST come before /:id route
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

      // Get current directory for ES modules
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Load AI classifications from data file
      const classificationsData = JSON.parse(
        readFileSync(join(__dirname, 'data', 'ai-classifications.json'), 'utf-8')
      );

      // Simple AI simulation based on filename and content patterns
      const filename = file.originalname.toLowerCase();
      let selectedClassification = classificationsData[Math.floor(Math.random() * classificationsData.length)];
      
      // Basic keyword matching for more realistic AI behavior
      for (const classification of classificationsData) {
        const matchingKeywords = classification.keywords.filter((keyword: string) => 
          filename.includes(keyword.toLowerCase())
        );
        if (matchingKeywords.length > 0) {
          selectedClassification = classification;
          break;
        }
      }
      
      // Generate summary from template
      const equipment = extractEquipmentFromFilename(filename);
      const area = extractAreaFromFilename(filename);
      const items = extractItemsFromFilename(filename);
      const subject = extractSubjectFromFilename(filename);
      const period = extractPeriodFromFilename(filename);
      const scope = extractScopeFromFilename(filename);
      
      let summary = selectedClassification.summaryTemplate
        .replace('{equipment}', equipment)
        .replace('{area}', area)
        .replace('{items}', items)
        .replace('{subject}', subject)
        .replace('{period}', period)
        .replace('{scope}', scope);
      
      const documentData = {
        title: selectedClassification.classification + ' - ' + file.originalname,
        department: selectedClassification.department,
        type: selectedClassification.type,
        summary: summary,
        content: `Uploaded file: ${file.originalname} (${file.size} bytes)`,
        status: 'active'
      };

      const validatedData = insertDocumentSchema.parse(documentData);
      const document = await storage.createDocument(validatedData);
      
      res.json({
        document,
        processing: {
          classification: selectedClassification.classification,
          summary: summary,
          department: selectedClassification.department
        }
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Search route moved above to prevent conflict with /:id route

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
