import { type Document, type InsertDocument, type WorkflowItem, type InsertWorkflowItem, type QrCode, type InsertQrCode, type Stats, type InsertStats, type SearchResult } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
    try {
      // Get current directory for ES modules
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Load documents from data file
      const documentsData = JSON.parse(
        readFileSync(join(__dirname, 'data', 'documents.json'), 'utf-8')
      );
      
      documentsData.forEach((docData: any) => {
        const document: Document = {
          id: randomUUID(),
          ...docData,
          uploadedAt: new Date(docData.uploadedAt),
          content: docData.content || null
        };
        this.documents.set(document.id, document);
      });

      // Load workflow items from data file
      const workflowData = JSON.parse(
        readFileSync(join(__dirname, 'data', 'workflow-items.json'), 'utf-8')
      );
      
      workflowData.forEach((itemData: any) => {
        const workflowItem: WorkflowItem = {
          id: randomUUID(),
          ...itemData,
          submittedAt: new Date(itemData.submittedAt),
          updatedAt: new Date(itemData.updatedAt)
        };
        this.workflowItems.set(workflowItem.id, workflowItem);
      });

      // Load QR codes from data file
      const qrCodeData = JSON.parse(
        readFileSync(join(__dirname, 'data', 'qr-codes.json'), 'utf-8')
      );
      
      qrCodeData.forEach((qrData: any) => {
        const qrCode: QrCode = {
          id: randomUUID(),
          ...qrData,
          createdAt: new Date(qrData.createdAt),
          updatedAt: new Date(qrData.updatedAt)
        };
        this.qrCodes.set(qrCode.id, qrCode);
      });

      // Load stats from data file
      const statsData = JSON.parse(
        readFileSync(join(__dirname, 'data', 'stats.json'), 'utf-8')
      );
      
      statsData.forEach((statData: any) => {
        const stat: Stats = {
          id: randomUUID(),
          metric: statData.metric,
          value: statData.value,
          updatedAt: new Date()
        };
        this.stats.set(stat.metric, stat);
      });
      
    } catch (error) {
      console.error('Error loading synthetic data:', error);
      throw new Error('Failed to initialize synthetic data from files');
    }
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
