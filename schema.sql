-- ==========================================================
-- ResearchOrbit - Academic Task Marketplace Database Schema
-- Focus: Task Request -> Task Details -> Submission -> Review/Status
-- STRICTLY ZERO PAYMENT / PRICING / FINANCIAL TABLES
-- ==========================================================

-- Enable UUID extension if using PostgreSQL/Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL, -- e.g. 'MD General Medicine', 'MS General Surgery', 'Senior Biostatistician'
    institution VARCHAR(255),
    expertise TEXT[], -- Array of skill/topic tags e.g. ARRAY['SPSS', 'Clinical Trials', 'Vancouver Formatting']
    bio TEXT,
    profile_image_url TEXT,
    role VARCHAR(50) DEFAULT 'user', -- 'user', 'contributor', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Freelance Tasks Table
CREATE TABLE IF NOT EXISTS freelance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'Thesis', 'Research', 'Manuscript', 'Abstract', 'Literature Review', 'Statistical Analysis', 'Presentation', 'Other'
    request_type VARCHAR(100) NOT NULL, -- 'Create a document', 'Edit an existing document', 'Review a document', 'Research assistance', 'Data analysis', 'Formatting', 'Other'
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '{}'::jsonb, -- { required_expertise: [], expected_format: '', referencing_style: '', word_count: '', instructions: '' }
    deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'In Progress', 'Submitted', 'Revision Requested', 'Completed'
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    allow_multiple_submissions BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_freelance_tasks_creator ON freelance_tasks(creator_id);
CREATE INDEX IF NOT EXISTS idx_freelance_tasks_assigned ON freelance_tasks(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_freelance_tasks_status ON freelance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_freelance_tasks_category ON freelance_tasks(category);

-- 3. Task Files (Attachments provided by task requester)
CREATE TABLE IF NOT EXISTS task_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES freelance_tasks(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100), -- 'pdf', 'docx', 'xlsx', 'pptx', 'zip', 'image'
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_files_task ON task_files(task_id);

-- 4. Task Submissions (Completed work uploaded by assigned contributor)
CREATE TABLE IF NOT EXISTS task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES freelance_tasks(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_note TEXT,
    version_number INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Pending Review', -- 'Pending Review', 'Revision Requested', 'Accepted'
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_submissions_task ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user ON task_submissions(submitted_by);

-- 5. Submission Files (Files attached to a completed work submission)
CREATE TABLE IF NOT EXISTS submission_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submission_files_submission ON submission_files(submission_id);

-- 6. Task Revisions Table
CREATE TABLE IF NOT EXISTS task_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES freelance_tasks(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES task_submissions(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    revision_message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_task_revisions_task ON task_revisions(task_id);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'task_claimed', 'work_submitted', 'revision_requested', 'revised_work_submitted', 'task_completed', 'new_task_posted'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_task_id UUID REFERENCES freelance_tasks(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- 8. Custom Categories Management Table
CREATE TABLE IF NOT EXISTS task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies Sample:
ALTER TABLE freelance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Tasks can be read by any authenticated user
CREATE POLICY "Public tasks are viewable by all users" ON freelance_tasks
    FOR SELECT USING (true);

-- Only creator can update their task (or assigned user claiming/updating)
CREATE POLICY "Creator or assignee can update task" ON freelance_tasks
    FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = assigned_user_id);

-- Submissions viewable by task creator, assignee, or admin
CREATE POLICY "Task submissions viewable by participants" ON task_submissions
    FOR SELECT USING (
        submitted_by = auth.uid() OR 
        EXISTS (SELECT 1 FROM freelance_tasks WHERE freelance_tasks.id = task_submissions.task_id AND freelance_tasks.creator_id = auth.uid())
    );

-- Notifications viewable only by recipient
CREATE POLICY "Users can only read own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());
