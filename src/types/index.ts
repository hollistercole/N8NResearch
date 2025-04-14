// Define TypeScript types for our database entities

export interface Task {
  task_id: number;
  task_name: string;
  task_description: string;
  original_prompt: string;
  completion_status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubTask {
  subtask_id: number;
  task_id: number;
  subtask_name: string;
  subtask_description: string;
  completion_status: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  product_id: number;
  subtask_id: number;
  product_title: string;
  product_slug: string;
  product_type_id: number;
  abstract: string;
  content: string;
  teaser_image_url: string;
  citations: string;
  authored_by: string;
  created_at: Date;
  updated_at: Date;
  type_name?: string; // Joined from ProductTypeRef
}

export interface Attachment {
  attachment_id: number;
  subtask_id: number;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_description: string;
  created_at: Date;
}

export interface ProductType {
  product_type_id: number;
  type_name: string;
}

// Extended interfaces with relationships
export interface TaskWithRelations extends Task {
  subtasks?: SubTask[];
}

export interface SubTaskWithRelations extends SubTask {
  task?: Task;
  products?: Product[];
  attachments?: Attachment[];
}

export interface ProductWithRelations extends Product {
  subtask?: SubTask;
  productType?: ProductType;
  attachments?: Attachment[]; // Related attachments
}

// Utility type for API responses
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
}

// Query result type for unknown results
export type QueryResult<T> = T[]; 