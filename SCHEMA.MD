# MariaDB Database Schema Guide

This document provides a guide to the database schema for developers working on this Next.js project.

## Connection Details

- **Host:** 54.176.154.219
- **Database:** AgentTasks
- **Server Version:** 10.2.10-MariaDB

## Tables Structure

### ProductTypeRef

A reference table for product types.

```sql
CREATE TABLE IF NOT EXISTS `ProductTypeRef` (
  `product_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) NOT NULL,
  PRIMARY KEY (`product_type_id`)
)
```

- **Primary Key:** `product_type_id`
- **Fields:**
  - `product_type_id` - Unique identifier for product types
  - `type_name` - Name of the product type

### Task

Represents a main task in the system.

```sql
CREATE TABLE IF NOT EXISTS `Task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_name` varchar(255) NOT NULL,
  `task_description` text DEFAULT NULL,
  `original_prompt` text DEFAULT NULL,
  `completion_status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`task_id`)
)
```

- **Primary Key:** `task_id`
- **Fields:**
  - `task_id` - Unique identifier for tasks
  - `task_name` - Name of the task
  - `task_description` - Detailed description of the task
  - `original_prompt` - Original prompt that created the task
  - `completion_status` - Boolean flag for task completion (0=incomplete, 1=complete)
  - `created_at` - When the task was created
  - `updated_at` - When the task was last updated

### SubTask

Represents a subtask belonging to a main task.

```sql
CREATE TABLE IF NOT EXISTS `SubTask` (
  `subtask_id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `subtask_name` varchar(255) NOT NULL,
  `subtaskdescript_ion` text DEFAULT NULL,
  `completion_status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`subtask_id`)
)
```

- **Primary Key:** `subtask_id`
- **Foreign Key:** `task_id` references `Task.task_id`
- **Fields:**
  - `subtask_id` - Unique identifier for subtasks
  - `task_id` - ID of the parent task
  - `subtask_name` - Name of the subtask
  - `subtaskdescript_ion` - Detailed description of the subtask (note the typo in column name)
  - `completion_status` - Boolean flag for subtask completion (0=incomplete, 1=complete)
  - `created_at` - When the subtask was created
  - `updated_at` - When the subtask was last updated

### Product

Represents a product generated for a subtask.

```sql
CREATE TABLE IF NOT EXISTS `Product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `subtask_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_slug` varchar(255) NOT NULL,
  `product_type_id` int(11) NOT NULL,
  `abstract` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `teaser_image_url` varchar(500) DEFAULT NULL,
  `citations` text DEFAULT NULL,
  `authored_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`product_id`)
)
```

- **Primary Key:** `product_id`
- **Foreign Keys:** 
  - `subtask_id` references `SubTask.subtask_id`
  - `product_type_id` references `ProductTypeRef.product_type_id`
- **Fields:**
  - `product_id` - Unique identifier for products
  - `subtask_id` - ID of the related subtask
  - `product_title` - Title of the product
  - `product_slug` - URL-friendly version of the title
  - `product_type_id` - Type of product (references ProductTypeRef)
  - `abstract` - Short summary of the product
  - `content` - Main content of the product
  - `teaser_image_url` - URL to image used for previews
  - `citations` - References/citations for the product content
  - `authored_by` - Creator of the product
  - `created_at` - When the product was created
  - `updated_at` - When the product was last updated

### Attachments

Represents files attached to subtasks.

```sql
CREATE TABLE IF NOT EXISTS `Attachments` (
  `attachment_id` int(11) NOT NULL AUTO_INCREMENT,
  `subtask_id` int(11) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`attachment_id`)
)
```

- **Primary Key:** `attachment_id`
- **Foreign Key:** `subtask_id` references `SubTask.subtask_id`
- **Fields:**
  - `attachment_id` - Unique identifier for attachments
  - `subtask_id` - ID of the related subtask
  - `file_url` - URL to access the attached file
  - `file_type` - Type of file (e.g., document, image)
  - `mime_type` - MIME type of the file
  - `file_description` - Description of the attachment
  - `created_at` - When the attachment was created

## Relationships

```
Task 1:N SubTask (A task can have multiple subtasks)
SubTask 1:N Product (A subtask can have multiple products)
SubTask 1:N Attachments (A subtask can have multiple attachments)
ProductTypeRef 1:N Product (A product type can be used by multiple products)
```

## Notes for Developers

- All tables use `AUTO_INCREMENT` for primary keys
- Most tables include `created_at` and `updated_at` timestamps
- There appears to be a typo in the SubTask table column: `subtaskdescript_ion` should likely be `subtask_description`
- The database uses Latin1 character set - be aware of potential encoding issues with special characters
- No foreign key constraints are explicitly defined in the schema, but they should be implemented in application code
