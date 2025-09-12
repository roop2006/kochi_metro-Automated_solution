import { type Document, type InsertDocument, type WorkflowItem, type InsertWorkflowItem, type QrCode, type InsertQrCode, type Stats, type InsertStats, type SearchResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  searchDocuments(query: string, type?: string): Promise<SearchResult[]>;
  
  // Workflow operations
  getWorkflowItems(): Promise<WorkflowItem[]>;
  getWorkflowItem(id: string): Promise<WorkflowItem | undefined>;
  createWorkflowItem(item: InsertWorkflowItem): Promise<WorkflowItem>;
  updateWorkflowItem(id: string, updates: Partial<WorkflowItem>): Promise<WorkflowItem | undefined>;
  
  // QR Code operations
  getQrCodes(): Promise<QrCode[]>;
  getQrCodeByCode(code: string): Promise<QrCode | undefined>;
  createQrCode(qr: InsertQrCode): Promise<QrCode>;
  updateQrCode(id: string, updates: Partial<QrCode>): Promise<QrCode | undefined>;
  
  // Stats operations
  getStats(): Promise<Stats[]>;
  updateStats(metric: string, value: string): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private documents: Map<string, Document>;
  private workflowItems: Map<string, WorkflowItem>;
  private qrCodes: Map<string, QrCode>;
  private stats: Map<string, Stats>;

  constructor() {
    this.documents = new Map();
    this.workflowItems = new Map();
    this.qrCodes = new Map();
    this.stats = new Map();
    this.initializeSyntheticData();
  }

  private initializeSyntheticData() {
    // Initialize with synthetic KMRL documents
    const syntheticDocs: Document[] = [
      {
        id: randomUUID(),
        title: "Maintenance Report - Train Car 205",
        department: "Maintenance",
        type: "maintenance",
        summary: "Comprehensive brake system inspection and routine maintenance completed. All systems operating within normal parameters.",
        content: "Weekly maintenance inspection of Train Car 205 brake systems completed successfully. All brake pads, discs, and hydraulic systems checked and found to be in excellent condition.",
        uploadedAt: new Date("2025-01-10"),
        status: "active"
      },
      {
        id: randomUUID(),
        title: "Safety Circular - Platform Guidelines",
        department: "Safety", 
        type: "safety",
        summary: "Updated safety protocols for platform operations during peak hours. Includes emergency evacuation procedures.",
        content: "New safety guidelines for platform management during peak hours to ensure passenger safety and efficient operations.",
        uploadedAt: new Date("2025-01-09"),
        status: "active"
      },
      {
        id: randomUUID(),
        title: "Vendor Invoice - Track Supplies",
        department: "Finance",
        type: "finance", 
        summary: "Monthly procurement invoice for track maintenance materials and specialized rail components.",
        content: "Invoice for track maintenance supplies including rails, fasteners, and specialized equipment for Q1 2025.",
        uploadedAt: new Date("2025-01-08"),
        status: "active"
      },
      {
        id: randomUUID(),
        title: "Meeting Minutes - Budget Review",
        department: "Finance",
        type: "finance",
        summary: "Quarterly budget review meeting discussing operational expenses and infrastructure investments.",
        content: "Detailed minutes from Q4 2024 budget review covering operational costs and planned infrastructure upgrades.",
        uploadedAt: new Date("2025-01-07"),
        status: "active"
      },
      {
        id: randomUUID(),
        title: "Equipment Inspection - Signal Systems",
        department: "Maintenance",
        type: "maintenance",
        summary: "Monthly inspection of automated signaling systems across all metro stations. All equipment functional.",
        content: "Comprehensive inspection report of all automated signaling systems, control panels, and safety interlocks.",
        uploadedAt: new Date("2025-01-06"),
        status: "active"
      },
      {
        id: randomUUID(),
        title: "Staff Training Manual - Emergency Response",
        department: "HR",
        type: "hr",
        summary: "Comprehensive training manual for emergency response procedures and passenger safety protocols.",
        content: "Updated emergency response training manual covering fire safety, medical emergencies, and evacuation procedures.",
        uploadedAt: new Date("2025-01-05"),
        status: "active"
      }
    ];

    syntheticDocs.forEach(doc => this.documents.set(doc.id, doc));

    // Initialize workflow items
    const syntheticWorkflow: WorkflowItem[] = [
      {
        id: randomUUID(),
        title: "Safety Audit Report - Q1 2025",
        description: "Comprehensive safety audit covering all metro stations and rolling stock",
        currentStage: "review",
        priority: "urgent",
        department: "Safety",
        submittedAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-08")
      },
      {
        id: randomUUID(),
        title: "Vendor Contract - Track Maintenance Services",
        description: "Annual contract renewal for specialized track maintenance and inspection services",
        currentStage: "review",
        priority: "normal",
        department: "Legal",
        submittedAt: new Date("2025-01-07"),
        updatedAt: new Date("2025-01-07")
      },
      {
        id: randomUUID(),
        title: "Maintenance Schedule - Rolling Stock Q2",
        description: "Quarterly maintenance schedule for all metro cars and locomotives",
        currentStage: "submitted",
        priority: "normal",
        department: "Maintenance",
        submittedAt: new Date("2025-01-06"),
        updatedAt: new Date("2025-01-06")
      },
      {
        id: randomUUID(),
        title: "Budget Revision - Infrastructure Upgrades",
        description: "Budget allocation for signal system modernization and platform improvements",
        currentStage: "review",
        priority: "urgent",
        department: "Finance",
        submittedAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-05")
      }
    ];

    syntheticWorkflow.forEach(item => this.workflowItems.set(item.id, item));

    // Initialize QR codes
    const syntheticQR: QrCode[] = [
      {
        id: randomUUID(),
        code: "MJC-2025-892",
        title: "Maintenance Job Card #MJC-2025-892",
        equipment: "Train Car 205",
        status: "in_progress",
        description: "Brake system inspection and routine maintenance work in progress",
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-10")
      },
      {
        id: randomUUID(),
        code: "MJC-2025-893",
        title: "Maintenance Job Card #MJC-2025-893",
        equipment: "Signal System Block A3",
        status: "pending",
        description: "Scheduled signal maintenance pending approval and resource allocation",
        createdAt: new Date("2025-01-09"),
        updatedAt: new Date("2025-01-09")
      },
      {
        id: randomUUID(),
        code: "MJC-2025-891",
        title: "Maintenance Job Card #MJC-2025-891",
        equipment: "Platform Safety Barriers",
        status: "completed",
        description: "Safety barrier inspection and testing completed successfully",
        createdAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-10")
      }
    ];

    syntheticQR.forEach(qr => this.qrCodes.set(qr.id, qr));

    // Initialize stats
    const syntheticStats: Stats[] = [
      {
        id: randomUUID(),
        metric: "documents_processed",
        value: "2847",
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        metric: "pending_approvals",
        value: "23",
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        metric: "completed_today",
        value: "156",
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        metric: "urgent_items",
        value: "7",
        updatedAt: new Date()
      }
    ];

    syntheticStats.forEach(stat => this.stats.set(stat.metric, stat));
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0)
    );
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...doc,
      id,
      content: doc.content || null,
      uploadedAt: new Date(),
      status: doc.status || 'active'
    };
    this.documents.set(id, document);
    
    // Update document count stat
    const currentCount = parseInt(this.stats.get('documents_processed')?.value || '0');
    await this.updateStats('documents_processed', (currentCount + 1).toString());
    
    return document;
  }

  async searchDocuments(query: string, type?: string): Promise<SearchResult[]> {
    const docs = Array.from(this.documents.values());
    let filtered = docs;

    if (type && type !== 'all') {
      filtered = docs.filter(doc => doc.type === type);
    }

    if (query) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.summary.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filtered.map(doc => ({
      id: doc.id,
      title: doc.title,
      department: doc.department,
      date: doc.uploadedAt?.toISOString().split('T')[0] || '',
      summary: doc.summary,
      type: doc.type as 'maintenance' | 'safety' | 'finance' | 'hr'
    }));
  }

  // Workflow operations
  async getWorkflowItems(): Promise<WorkflowItem[]> {
    return Array.from(this.workflowItems.values()).sort(
      (a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0)
    );
  }

  async getWorkflowItem(id: string): Promise<WorkflowItem | undefined> {
    return this.workflowItems.get(id);
  }

  async createWorkflowItem(item: InsertWorkflowItem): Promise<WorkflowItem> {
    const id = randomUUID();
    const workflowItem: WorkflowItem = {
      ...item,
      id,
      currentStage: item.currentStage || 'submitted',
      priority: item.priority || 'normal',
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    this.workflowItems.set(id, workflowItem);
    return workflowItem;
  }

  async updateWorkflowItem(id: string, updates: Partial<WorkflowItem>): Promise<WorkflowItem | undefined> {
    const existing = this.workflowItems.get(id);
    if (!existing) return undefined;

    const updated: WorkflowItem = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.workflowItems.set(id, updated);
    return updated;
  }

  // QR Code operations
  async getQrCodes(): Promise<QrCode[]> {
    return Array.from(this.qrCodes.values());
  }

  async getQrCodeByCode(code: string): Promise<QrCode | undefined> {
    return Array.from(this.qrCodes.values()).find(qr => qr.code === code);
  }

  async createQrCode(qr: InsertQrCode): Promise<QrCode> {
    const id = randomUUID();
    const qrCode: QrCode = {
      ...qr,
      id,
      status: qr.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async updateQrCode(id: string, updates: Partial<QrCode>): Promise<QrCode | undefined> {
    const existing = this.qrCodes.get(id);
    if (!existing) return undefined;

    const updated: QrCode = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.qrCodes.set(id, updated);
    return updated;
  }

  // Stats operations
  async getStats(): Promise<Stats[]> {
    return Array.from(this.stats.values());
  }

  async updateStats(metric: string, value: string): Promise<Stats> {
    const existing = this.stats.get(metric);
    const stat: Stats = {
      id: existing?.id || randomUUID(),
      metric,
      value,
      updatedAt: new Date()
    };
    this.stats.set(metric, stat);
    return stat;
  }
}

export const storage = new MemStorage();
