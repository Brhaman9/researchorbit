/**
 * ResearchOrbit - Academic Task Marketplace Engine
 * Pure Academic Collaboration - STRICTLY ZERO PAYMENT / PRICING
 * Workflow:
 * 1. Task Publishing: Requester creates a task (text requirements & guidelines only - NO file upload when publishing).
 * 2. Task Fulfillment: Contributor claims task and uploads completed deliverable documents (.docx, .pdf, .xlsx, etc.) with submission notes.
 * 3. Requester Review: Author reviews and downloads submitted deliverable documents, then accepts or requests revisions.
 */

(function () {
  'use strict';

  // Storage Keys (Clean v8 storage without college names)
  const STORAGE_TASKS = 'researchorbit_tasks_v8';
  const STORAGE_USERS = 'researchorbit_users_v8';
  const STORAGE_ACTIVE_USER = 'researchorbit_active_user_v8';
  const STORAGE_NOTIFICATIONS = 'researchorbit_notifications_v8';
  const STORAGE_CATEGORIES = 'researchorbit_categories_v8';

  // Pre-loaded Medical/Academic User Personas
  const SEED_USERS = [
    {
      id: 'user-1',
      name: 'Dr. Rajesh Sharma',
      designation: 'MD Resident (General Medicine)',
      expertise: ['Internal Medicine', 'Sepsis & AKI', 'Clinical Proformas', 'ICU Protocols'],
      bio: 'Postgraduate resident specializing in internal medicine, critical care nephrology, and clinical dissertation structuring.',
      avatarBg: '#2f68b2',
      initials: 'RS'
    },
    {
      id: 'user-2',
      name: 'Dr. Ananya Iyer',
      designation: 'MS Senior Registrar (General Surgery)',
      expertise: ['Laparoscopic Surgery', 'Surgical Trials', 'Vancouver Referencing', 'Case Reports'],
      bio: 'Surgical fellow experienced in minimal access surgery, clinical audit methodologies, and journal manuscript peer review.',
      avatarBg: '#0b7285',
      initials: 'AI'
    },
    {
      id: 'user-3',
      name: 'Dr. Vikram Malhotra',
      designation: 'Senior Biostatistician & Methodologist',
      expertise: ['SPSS v28', 'R Biostatistics', 'Logistic Regression', 'ROC Curves', 'Sample Size Estimation'],
      bio: 'Medical statistician supporting postgraduate dissertations, survival analysis, Master Chart variable mapping, and inferential tests.',
      avatarBg: '#2b8a3e',
      initials: 'VM'
    }
  ];

  // Default Categories
  const DEFAULT_CATEGORIES = [
    'Thesis',
    'Research',
    'Manuscript',
    'Abstract',
    'Literature Review',
    'Statistical Analysis',
    'Presentation',
    'Other'
  ];

  // Pre-loaded Realistic Academic Tasks in Various Workflow States
  const SEED_TASKS = [
    {
      id: 'task-101',
      creator_id: 'user-1',
      title: 'Thesis Introduction & Literature Synthesis: Clinical Biomarkers in Sepsis AKI',
      category: 'Thesis',
      request_type: 'Create a document',
      description: 'Need structured Chapter 1 (Introduction) and Chapter 2 (Review of Literature) for an MD dissertation evaluating serum NGAL and continuous glycemic fluctuations as early predictors of Acute Kidney Injury in intensive care sepsis patients.',
      requirements: {
        expertise: ['Clinical Medicine', 'Critical Care', 'Vancouver Referencing'],
        subject: 'Internal Medicine / Critical Care Nephrology',
        expected_format: 'MS Word format strictly adhering to dissertation formatting guidelines',
        referencing_style: 'Vancouver referencing (minimum 45 peer-reviewed citations from PubMed/Scopus, 2018-2025)',
        word_count: 'Approx. 4,500 - 5,500 words across Chapters 1 & 2',
        instructions: 'Include operational definitions of KDIGO criteria for AKI, Surviving Sepsis Campaign 2021 guidelines, and pathophysiological pathways of tubular biomarker release.'
      },
      deadline: '2026-10-15',
      status: 'Open',
      assigned_user_id: null,
      assigned_at: null,
      submissions: [],
      revisions: [],
      created_at: '2026-09-08T10:30:00Z'
    },
    {
      id: 'task-102',
      creator_id: 'user-2',
      title: 'SPSS Inferential Biostatistics & ROC Diagnostic Curves for Surgical Trial',
      category: 'Statistical Analysis',
      request_type: 'Data analysis',
      description: 'Require complete statistical analysis for a comparative clinical study (N=120) comparing Laparoscopic vs Open Appendectomy in complicated appendicitis. Need Master Chart coding, descriptive tables (Mean ± SD), Mann-Whitney U tests, Fisher exact tests, and ROC curves for CRP cut-offs.',
      requirements: {
        expertise: ['SPSS v27/28', 'Parametric & Non-parametric Tests', 'GraphPad Prism'],
        subject: 'General Surgery / Clinical Biostatistics',
        expected_format: 'Coded SPSS outputs, Master Chart variable documentation, and formatted summary observation tables',
        referencing_style: 'Standard biomedical statistical notations (p-values, 95% CI)',
        word_count: 'Tabular observations + analytical interpretation notes',
        instructions: 'Calculate sensitivity, specificity, positive predictive value (PPV), and negative predictive value (NPV) for post-op CRP on Day 3.'
      },
      deadline: '2026-09-28',
      status: 'In Progress',
      assigned_user_id: 'user-3', // Assigned to Dr. Vikram Malhotra
      assigned_at: '2026-09-09T14:15:00Z',
      submissions: [],
      revisions: [],
      created_at: '2026-09-06T08:00:00Z'
    },
    {
      id: 'task-103',
      creator_id: 'user-1',
      title: 'Manuscript Formatting & Vancouver Refinement for PubMed Indexed Journal',
      category: 'Manuscript',
      request_type: 'Edit an existing document',
      description: 'Original research manuscript on "Glycemic Variability in Diabetic Ketoacidosis" needs journal-specific restructuring according to ICMJE and BioMed Central guidelines. Requires reference re-formatting to Vancouver and table layout cleanup.',
      requirements: {
        expertise: ['Medical Editing', 'ICMJE Standards', 'EndNote/Zotero'],
        subject: 'Endocrinology & Emergency Medicine',
        expected_format: 'Track changes documentation and clean manuscript text',
        referencing_style: 'BioMed Central Vancouver format',
        word_count: 'Manuscript word count 3,200 words (excluding abstract and references)',
        instructions: 'Ensure Title page contains running title, author contributions statement, and structured 250-word abstract.'
      },
      deadline: '2026-09-22',
      status: 'Submitted', // Submitted with deliverable docs by contributor
      assigned_user_id: 'user-2', // Dr. Ananya Iyer
      assigned_at: '2026-09-07T11:00:00Z',
      submissions: [
        {
          id: 'sub-301',
          submitted_by: 'user-2',
          submitted_at: '2026-09-10T16:45:00Z',
          submission_note: 'Completed full Vancouver referencing overhaul (38 citations verified against PubMed IDs), applied BioMed Central formatting guidelines, restructured Discussion section for clarity, and formatted tabular observations with 95% confidence intervals.',
          files: [
            { name: 'DKA_Manuscript_Formatted_Clean.docx', size: '940 KB', type: 'docx' },
            { name: 'DKA_Reference_Audit_Report.pdf', size: '420 KB', type: 'pdf' }
          ]
        }
      ],
      revisions: [],
      created_at: '2026-09-05T09:00:00Z'
    },
    {
      id: 'task-104',
      creator_id: 'user-2',
      title: 'Case Report Formatting: Rare Presentation of Extra-Adrenal Pheochromocytoma',
      category: 'Research',
      request_type: 'Review a document',
      description: 'Case report of a 32-year-old female presenting with fluctuating hypertension and organ of Zuckerkandl paraganglioma. Need CARE-guideline compliant narrative restructuring and radiology image annotation review.',
      requirements: {
        expertise: ['Clinical Case Reports', 'CARE Guidelines', 'Radiology Interpretation'],
        subject: 'Endocrine Surgery / Radiodiagnosis',
        expected_format: 'Formatted narrative section with CARE checklist alignment',
        referencing_style: 'Vancouver (15 citations)',
        word_count: '1,500 words',
        instructions: 'Include detailed timeline of diagnostic workup (plasma metanephrines, CECT Abdomen, MIBG scan).'
      },
      deadline: '2026-10-05',
      status: 'Revision Requested',
      assigned_user_id: 'user-1', // Dr. Rajesh Sharma
      assigned_at: '2026-09-04T12:00:00Z',
      submissions: [
        {
          id: 'sub-401',
          submitted_by: 'user-1',
          submitted_at: '2026-09-08T18:00:00Z',
          submission_note: 'Initial CARE compliant draft prepared with discussion on differential diagnosis and surgical pathology correlations.',
          files: [
            { name: 'Case_Report_Draft_v1.docx', size: '1.2 MB', type: 'docx' }
          ]
        }
      ],
      revisions: [
        {
          id: 'rev-401',
          requested_by: 'user-2',
          created_at: '2026-09-09T10:00:00Z',
          revision_message: 'Thank you for the draft. Please expand the pre-operative alpha-blockade protocol (Phenoxybenzamine dosage titration) in the management section and add detailed diagnostic criteria descriptions.',
          status: 'Active'
        }
      ],
      created_at: '2026-09-03T11:30:00Z'
    },
    {
      id: 'task-105',
      creator_id: 'user-3',
      title: 'Literature Review on Functional Outcomes of PFNA-2 in Osteoporotic Hip Fractures',
      category: 'Literature Review',
      request_type: 'Research assistance',
      description: 'Comprehensive narrative synthesis of clinical literature comparing Proximal Femoral Nail Antirotation (PFNA-2) versus Dynamic Hip Screw (DHS) in AO/OTA 31-A2 unstable trochanteric fractures in elderly patients.',
      requirements: {
        expertise: ['Orthopaedic Surgery', 'Systematic Literature Search', 'PRISMA Flowchart'],
        subject: 'Orthopaedics & Traumatology',
        expected_format: 'Structured literature synthesis with comparative evidence summary matrix',
        referencing_style: 'Vancouver referencing (35 recent citations)',
        word_count: '3,000 words',
        instructions: 'Highlight tip-apex distance (TAD), cut-out rates, and Harris Hip Score progression.'
      },
      deadline: '2026-09-18',
      status: 'Completed',
      assigned_user_id: 'user-2', // Dr. Ananya Iyer
      assigned_at: '2026-08-28T09:00:00Z',
      submissions: [
        {
          id: 'sub-501',
          submitted_by: 'user-2',
          submitted_at: '2026-09-02T15:00:00Z',
          submission_note: 'Completed synthesis with 36 citations and evidence summary table comparing biomechanical parameters, surgical duration, and cut-out risks.',
          files: [
            { name: 'PFNA2_Literature_Review_Final.docx', size: '1.5 MB', type: 'docx' },
            { name: 'Evidence_Matrix_Table.xlsx', size: '340 KB', type: 'xlsx' }
          ]
        }
      ],
      revisions: [],
      created_at: '2026-08-25T14:00:00Z'
    },
    {
      id: 'task-106',
      creator_id: 'user-2',
      title: 'Conference Poster Slide Deck: Endothelial Cell Density in Phacoemulsification',
      category: 'Presentation',
      request_type: 'Create a document',
      description: 'Prepare a high-impact 1-slide digital e-poster and 8-slide PowerPoint defense presentation for national ophthalmology conference presenting specular microscopy endothelial cell loss in diabetic vs non-diabetic cataract patients.',
      requirements: {
        expertise: ['Medical Presentation Design', 'Ophthalmology Data Visualization'],
        subject: 'Ophthalmology / Cataract Surgery',
        expected_format: 'Structured slide breakdown with visual bullet layout',
        referencing_style: 'Vancouver footnotes',
        word_count: 'Concise visual bullet formatting',
        instructions: 'Include graphical representations of pre-op vs post-op endothelial cell density (ECD) and coefficient of variation (CV).'
      },
      deadline: '2026-10-20',
      status: 'Open',
      assigned_user_id: null,
      assigned_at: null,
      submissions: [],
      revisions: [],
      created_at: '2026-09-10T12:00:00Z'
    }
  ];

  // Initial Notifications
  const SEED_NOTIFICATIONS = [
    {
      id: 'notif-1',
      user_id: 'user-1',
      type: 'work_submitted',
      title: 'Work Submitted for Review',
      message: 'Dr. Ananya Iyer has submitted completed deliverables for "Manuscript Formatting & Vancouver Refinement".',
      related_task_id: 'task-103',
      is_read: false,
      created_at: '2026-09-10T16:45:00Z'
    },
    {
      id: 'notif-2',
      user_id: 'user-1',
      type: 'revision_requested',
      title: 'Revision Requested',
      message: 'Dr. Ananya Iyer requested modifications on "Case Report: Extra-Adrenal Pheochromocytoma".',
      related_task_id: 'task-104',
      is_read: false,
      created_at: '2026-09-09T10:00:00Z'
    },
    {
      id: 'notif-3',
      user_id: 'user-2',
      type: 'task_completed',
      title: 'Task Accepted & Completed',
      message: 'Dr. Vikram Malhotra marked your literature review task as Completed with appreciation.',
      related_task_id: 'task-105',
      is_read: true,
      created_at: '2026-09-02T16:00:00Z'
    }
  ];

  // State Manager
  class MarketplaceState {
    constructor() {
      this.init();
    }

    init() {
      if (!localStorage.getItem(STORAGE_USERS)) {
        localStorage.setItem(STORAGE_USERS, JSON.stringify(SEED_USERS));
      }
      if (!localStorage.getItem(STORAGE_TASKS)) {
        localStorage.setItem(STORAGE_TASKS, JSON.stringify(SEED_TASKS));
      }
      if (!localStorage.getItem(STORAGE_NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
      }
      if (!localStorage.getItem(STORAGE_CATEGORIES)) {
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      }
      if (!localStorage.getItem(STORAGE_ACTIVE_USER)) {
        localStorage.setItem(STORAGE_ACTIVE_USER, 'user-1');
      }
    }

    getUsers() {
      return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
    }

    getActiveUser() {
      const activeId = localStorage.getItem(STORAGE_ACTIVE_USER) || 'user-1';
      const users = this.getUsers();
      return users.find((u) => u.id === activeId) || users[0];
    }

    setActiveUser(userId) {
      localStorage.setItem(STORAGE_ACTIVE_USER, userId);
      this.triggerUpdate();
    }

    getTasks() {
      return JSON.parse(localStorage.getItem(STORAGE_TASKS) || '[]');
    }

    saveTasks(tasks) {
      localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
      this.triggerUpdate();
    }

    getCategories() {
      return JSON.parse(localStorage.getItem(STORAGE_CATEGORIES) || '[]');
    }

    addCategory(catName) {
      const cats = this.getCategories();
      const trimmed = catName.trim();
      if (trimmed && !cats.includes(trimmed)) {
        cats.push(trimmed);
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(cats));
        this.triggerUpdate();
      }
    }

    getNotifications(userId) {
      const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS) || '[]');
      return all.filter((n) => n.user_id === userId);
    }

    addNotification({ userId, type, title, message, relatedTaskId }) {
      const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS) || '[]');
      const newNotif = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        user_id: userId,
        type,
        title,
        message,
        related_task_id: relatedTaskId,
        is_read: false,
        created_at: new Date().toISOString()
      };
      all.unshift(newNotif);
      localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(all));
      this.triggerUpdate();
    }

    markNotificationsAsRead(userId) {
      const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS) || '[]');
      all.forEach((n) => {
        if (n.user_id === userId) n.is_read = true;
      });
      localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(all));
      this.triggerUpdate();
    }

    // Task Actions (Publishing: NO file upload by creator)
    postTask(taskData) {
      const tasks = this.getTasks();
      const activeUser = this.getActiveUser();

      const newTask = {
        id: 'task-' + Date.now(),
        creator_id: activeUser.id,
        title: taskData.title,
        category: taskData.category,
        request_type: taskData.request_type,
        description: taskData.description,
        requirements: taskData.requirements || {},
        deadline: taskData.deadline || null,
        status: 'Open',
        assigned_user_id: null,
        assigned_at: null,
        submissions: [],
        revisions: [],
        created_at: new Date().toISOString()
      };

      tasks.unshift(newTask);
      this.saveTasks(tasks);

      // Notify other users
      this.getUsers().forEach((u) => {
        if (u.id !== activeUser.id) {
          this.addNotification({
            userId: u.id,
            type: 'new_task_posted',
            title: 'New Academic Task Available',
            message: `${activeUser.name} posted: "${newTask.title}"`,
            relatedTaskId: newTask.id
          });
        }
      });

      return newTask;
    }

    claimTask(taskId) {
      const tasks = this.getTasks();
      const task = tasks.find((t) => t.id === taskId);
      const activeUser = this.getActiveUser();

      if (!task) return { success: false, message: 'Task not found' };
      if (task.status !== 'Open') return { success: false, message: 'This task is no longer open for claiming.' };
      if (task.creator_id === activeUser.id) return { success: false, message: 'You cannot claim a task you created yourself.' };

      task.status = 'In Progress';
      task.assigned_user_id = activeUser.id;
      task.assigned_at = new Date().toISOString();

      this.saveTasks(tasks);

      // Notify task requester
      this.addNotification({
        userId: task.creator_id,
        type: 'task_claimed',
        title: 'Task Claimed by Contributor',
        message: `${activeUser.name} (${activeUser.designation}) has claimed your task "${task.title}".`,
        relatedTaskId: task.id
      });

      return { success: true, task };
    }

    // Task Fulfillment (Uploading completed deliverable documents by contributor)
    submitWork(taskId, submissionData) {
      const tasks = this.getTasks();
      const task = tasks.find((t) => t.id === taskId);
      const activeUser = this.getActiveUser();

      if (!task) return { success: false, message: 'Task not found' };
      if (task.assigned_user_id !== activeUser.id) {
        return { success: false, message: 'Only the assigned contributor can submit work.' };
      }

      const newSubmission = {
        id: 'sub-' + Date.now(),
        submitted_by: activeUser.id,
        submitted_at: new Date().toISOString(),
        submission_note: submissionData.note || '',
        files: submissionData.files || []
      };

      task.submissions.push(newSubmission);
      task.status = 'Submitted';

      // If there was an active revision, mark it resolved
      task.revisions.forEach((r) => {
        if (r.status === 'Active') r.status = 'Resolved';
      });

      this.saveTasks(tasks);

      // Notify task requester
      this.addNotification({
        userId: task.creator_id,
        type: 'work_submitted',
        title: 'Completed Deliverable Submitted',
        message: `${activeUser.name} submitted completed deliverables for "${task.title}". Please review the documents.`,
        relatedTaskId: task.id
      });

      return { success: true, task };
    }

    requestRevision(taskId, revisionMessage) {
      const tasks = this.getTasks();
      const task = tasks.find((t) => t.id === taskId);
      const activeUser = this.getActiveUser();

      if (!task) return { success: false, message: 'Task not found' };
      if (task.creator_id !== activeUser.id) {
        return { success: false, message: 'Only the task creator can request revisions.' };
      }

      const newRevision = {
        id: 'rev-' + Date.now(),
        requested_by: activeUser.id,
        revision_message: revisionMessage,
        created_at: new Date().toISOString(),
        status: 'Active'
      };

      task.revisions.push(newRevision);
      task.status = 'Revision Requested';

      this.saveTasks(tasks);

      // Notify assigned contributor
      if (task.assigned_user_id) {
        this.addNotification({
          userId: task.assigned_user_id,
          type: 'revision_requested',
          title: 'Revision Requested by Author',
          message: `${activeUser.name} requested changes on "${task.title}": "${revisionMessage}"`,
          relatedTaskId: task.id
        });
      }

      return { success: true, task };
    }

    markCompleted(taskId) {
      const tasks = this.getTasks();
      const task = tasks.find((t) => t.id === taskId);
      const activeUser = this.getActiveUser();

      if (!task) return { success: false, message: 'Task not found' };
      if (task.creator_id !== activeUser.id) {
        return { success: false, message: 'Only the task creator can mark a task as completed.' };
      }

      task.status = 'Completed';
      task.completed_at = new Date().toISOString();

      this.saveTasks(tasks);

      // Notify assigned contributor
      if (task.assigned_user_id) {
        this.addNotification({
          userId: task.assigned_user_id,
          type: 'task_completed',
          title: 'Task Marked Completed & Accepted!',
          message: `Congratulations! ${activeUser.name} has accepted your submission for "${task.title}".`,
          relatedTaskId: task.id
        });
      }

      return { success: true, task };
    }

    deleteTask(taskId) {
      let tasks = this.getTasks();
      tasks = tasks.filter((t) => t.id !== taskId);
      this.saveTasks(tasks);
    }

    triggerUpdate() {
      window.dispatchEvent(new CustomEvent('marketplace:state_change'));
    }
  }

  // Instantiate State
  const state = new MarketplaceState();

  // Helper Functions
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const showToast = (message, type = 'success') => {
    const existing = document.querySelector('.marketplace-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `marketplace-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✓' : '!'}</span>
        <span>${message}</span>
      </div>
      <button class="toast-close" type="button">&times;</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  };

  // UI Controller
  class MarketplaceUI {
    constructor() {
      this.activeCategory = 'All Tasks';
      this.activeStatus = 'all';
      this.searchQuery = '';
      this.sortBy = 'newest';
      this.attachedFilesSubmit = [];

      this.initElements();
      this.bindEvents();
      this.render();
    }

    initElements() {
      // Main UI anchors
      this.gridEl = document.getElementById('task-marketplace-grid');
      this.categoryFilterWrap = document.getElementById('marketplace-category-filters');
      this.statusFilterEl = document.getElementById('filter-status-select');
      this.sortByEl = document.getElementById('filter-sort-select');
      this.searchInputEl = document.getElementById('marketplace-search-input');
      this.personaSelectEl = document.getElementById('active-persona-select');
      this.notifBtnEl = document.getElementById('marketplace-notif-btn');
      this.notifBadgeEl = document.getElementById('notif-unread-badge');
      this.notifDropdownEl = document.getElementById('marketplace-notif-dropdown');
      this.taskCountEl = document.getElementById('marketplace-task-count');

      // Modals
      this.postModal = document.getElementById('modal-post-task');
      this.detailsModal = document.getElementById('modal-task-details');
      this.workspaceModal = document.getElementById('modal-workspace');
      this.reviewModal = document.getElementById('modal-review-submission');
    }

    bindEvents() {
      window.addEventListener('marketplace:state_change', () => {
        this.render();
      });

      // Persona Switcher
      if (this.personaSelectEl) {
        this.personaSelectEl.addEventListener('change', (e) => {
          state.setActiveUser(e.target.value);
          const user = state.getActiveUser();
          showToast(`Switched active profile to: ${user.name} (${user.designation})`, 'success');
        });
      }

      // Search & Filters
      if (this.searchInputEl) {
        this.searchInputEl.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderTasks();
        });
      }

      if (this.statusFilterEl) {
        this.statusFilterEl.addEventListener('change', (e) => {
          this.activeStatus = e.target.value;
          this.renderTasks();
        });
      }

      if (this.sortByEl) {
        this.sortByEl.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.renderTasks();
        });
      }

      // Notifications Bell
      if (this.notifBtnEl && this.notifDropdownEl) {
        this.notifBtnEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = this.notifDropdownEl.classList.toggle('open');
          if (isOpen) {
            this.renderNotificationsList();
            state.markNotificationsAsRead(state.getActiveUser().id);
          }
        });

        document.addEventListener('click', (e) => {
          if (!this.notifDropdownEl.contains(e.target) && !this.notifBtnEl.contains(e.target)) {
            this.notifDropdownEl.classList.remove('open');
          }
        });
      }

      // Primary Action Buttons
      const postBtn = document.getElementById('btn-open-post-task');
      if (postBtn) {
        postBtn.addEventListener('click', () => this.openPostTaskModal());
      }

      // Modal Close Triggers
      document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const modal = e.target.closest('.marketplace-modal-overlay');
          if (modal) modal.classList.remove('open');
        });
      });

      // Post Form Submission & Workspace Submissions
      this.initPostTaskForm();
      this.initWorkspaceForm();
      this.initReviewActions();
    }

    render() {
      this.renderPersonaDropdown();
      this.renderCategoriesBar();
      this.renderNotificationsBadge();
      this.renderTasks();
    }

    renderPersonaDropdown() {
      if (!this.personaSelectEl) return;
      const users = state.getUsers();
      const activeUser = state.getActiveUser();

      this.personaSelectEl.innerHTML = users
        .map(
          (u) =>
            `<option value="${u.id}" ${u.id === activeUser.id ? 'selected' : ''}>
              ${u.name} — ${u.designation}
            </option>`
        )
        .join('');
    }

    renderCategoriesBar() {
      if (!this.categoryFilterWrap) return;
      const categories = ['All Tasks', ...state.getCategories()];

      this.categoryFilterWrap.innerHTML = categories
        .map(
          (cat) => `
          <button type="button" class="category-chip ${this.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `
        )
        .join('');

      this.categoryFilterWrap.querySelectorAll('.category-chip').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.activeCategory = btn.getAttribute('data-cat');
          this.renderCategoriesBar();
          this.renderTasks();
        });
      });
    }

    renderNotificationsBadge() {
      if (!this.notifBadgeEl) return;
      const activeUser = state.getActiveUser();
      const notifs = state.getNotifications(activeUser.id);
      const unread = notifs.filter((n) => !n.is_read).length;

      if (unread > 0) {
        this.notifBadgeEl.textContent = unread;
        this.notifBadgeEl.style.display = 'inline-flex';
      } else {
        this.notifBadgeEl.style.display = 'none';
      }
    }

    renderNotificationsList() {
      const listEl = document.getElementById('marketplace-notif-list');
      if (!listEl) return;
      const activeUser = state.getActiveUser();
      const notifs = state.getNotifications(activeUser.id);

      if (notifs.length === 0) {
        listEl.innerHTML = '<div class="notif-empty">No notifications yet.</div>';
        return;
      }

      listEl.innerHTML = notifs
        .map(
          (n) => `
          <div class="notif-item ${!n.is_read ? 'unread' : ''}" data-task-id="${n.related_task_id || ''}">
            <div class="notif-header">
              <strong>${n.title}</strong>
              <small>${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
            <p>${n.message}</p>
          </div>
        `
        )
        .join('');

      listEl.querySelectorAll('.notif-item').forEach((item) => {
        item.addEventListener('click', () => {
          const taskId = item.getAttribute('data-task-id');
          if (taskId) {
            this.notifDropdownEl.classList.remove('open');
            this.openTaskDetailsModal(taskId);
          }
        });
      });
    }

    renderTasks() {
      if (!this.gridEl) return;
      let tasks = state.getTasks();

      // Category filter
      if (this.activeCategory !== 'All Tasks') {
        tasks = tasks.filter((t) => t.category === this.activeCategory);
      }

      // Status filter
      if (this.activeStatus !== 'all') {
        tasks = tasks.filter((t) => t.status.toLowerCase() === this.activeStatus.toLowerCase());
      }

      // Search filter
      if (this.searchQuery) {
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(this.searchQuery) ||
            t.description.toLowerCase().includes(this.searchQuery) ||
            t.category.toLowerCase().includes(this.searchQuery) ||
            (t.requirements && t.requirements.subject && t.requirements.subject.toLowerCase().includes(this.searchQuery))
        );
      }

      // Sorting
      if (this.sortBy === 'newest') {
        tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (this.sortBy === 'deadline') {
        tasks.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
      }

      // Update count
      if (this.taskCountEl) {
        this.taskCountEl.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'} found`;
      }

      if (tasks.length === 0) {
        this.gridEl.innerHTML = `
          <div class="marketplace-empty-state">
            <div class="empty-icon">📋</div>
            <h3>No academic tasks match your current filters</h3>
            <p>Try resetting your search query, switching categories, or be the first to post a new academic requirement.</p>
            <button class="button button-secondary" type="button" id="btn-reset-filters">Reset All Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('btn-reset-filters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            this.activeCategory = 'All Tasks';
            this.activeStatus = 'all';
            this.searchQuery = '';
            if (this.searchInputEl) this.searchInputEl.value = '';
            if (this.statusFilterEl) this.statusFilterEl.value = 'all';
            this.render();
          });
        }
        return;
      }

      const users = state.getUsers();

      this.gridEl.innerHTML = tasks
        .map((task) => {
          const creator = users.find((u) => u.id === task.creator_id) || {
            name: 'Medical Resident',
            designation: 'Resident Doctor',
            initials: 'DR',
            avatarBg: '#2f68b2'
          };

          const daysLeft = getDaysRemaining(task.deadline);
          let deadlineBadge = '';
          if (task.deadline) {
            if (daysLeft !== null && daysLeft < 0) {
              deadlineBadge = `<span class="deadline-pill overdue">Expired</span>`;
            } else if (daysLeft !== null && daysLeft <= 3) {
              deadlineBadge = `<span class="deadline-pill urgent">Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</span>`;
            } else {
              deadlineBadge = `<span class="deadline-pill">Due: ${formatDate(task.deadline)}</span>`;
            }
          }

          const statusClass = task.status.toLowerCase().replace(/\s+/g, '-');
          const skillTags = (task.requirements && task.requirements.expertise) || [];

          return `
            <article class="task-card reveal is-visible" data-task-id="${task.id}">
              <div class="task-card-header">
                <div class="task-category-meta">
                  <span class="task-cat-pill">${task.category}</span>
                  <span class="task-request-type">${task.request_type}</span>
                </div>
                <span class="task-status-badge status-${statusClass}">${task.status}</span>
              </div>

              <h3 class="task-card-title">${task.title}</h3>
              <p class="task-card-desc">${task.description}</p>

              ${
                skillTags.length > 0
                  ? `
                <div class="task-skills-list">
                  ${skillTags.slice(0, 3).map((tag) => `<span class="skill-tag">${tag}</span>`).join('')}
                  ${skillTags.length > 3 ? `<span class="skill-tag more">+${skillTags.length - 3}</span>` : ''}
                </div>
              `
                  : ''
              }

              <div class="task-card-footer">
                <div class="task-author-info">
                  <div class="author-avatar" style="background: ${creator.avatarBg};">${creator.initials}</div>
                  <div class="author-details">
                    <strong>${creator.name}</strong>
                    <small>${creator.designation}</small>
                  </div>
                </div>
                <div class="task-actions-col">
                  ${deadlineBadge}
                  <button class="button button-primary btn-view-task" data-id="${task.id}" type="button">
                    View Details
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      this.gridEl.querySelectorAll('.btn-view-task').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          this.openTaskDetailsModal(id);
        });
      });
    }

    // ==========================================
    // 1. Post a Task Modal (NO file upload on publish)
    // ==========================================
    initPostTaskForm() {
      const form = document.getElementById('form-post-task');

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);

          const title = formData.get('title');
          const category = formData.get('category');
          const request_type = formData.get('request_type');
          const description = formData.get('description');
          const deadline = formData.get('deadline');

          const expertiseStr = formData.get('expertise') || '';
          const expertise = expertiseStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

          const requirements = {
            expertise,
            subject: formData.get('subject') || '',
            expected_format: formData.get('expected_format') || '',
            referencing_style: formData.get('referencing_style') || '',
            word_count: formData.get('word_count') || '',
            instructions: formData.get('instructions') || ''
          };

          const task = state.postTask({
            title,
            category,
            request_type,
            description,
            deadline,
            requirements
          });

          this.postModal.classList.remove('open');
          form.reset();
          showToast('Your academic task has been posted successfully!', 'success');
          this.openTaskDetailsModal(task.id);
        });
      }
    }

    openPostTaskModal() {
      if (!this.postModal) return;
      const catSelect = document.getElementById('post-category-select');
      if (catSelect) {
        catSelect.innerHTML = state
          .getCategories()
          .map((cat) => `<option value="${cat}">${cat}</option>`)
          .join('');
      }
      this.postModal.classList.add('open');
    }

    // ==========================================
    // 2. Task Details & Claiming Flow
    // ==========================================
    openTaskDetailsModal(taskId) {
      const task = state.getTasks().find((t) => t.id === taskId);
      if (!task || !this.detailsModal) return;

      const activeUser = state.getActiveUser();
      const users = state.getUsers();
      const creator = users.find((u) => u.id === task.creator_id) || { name: 'Doctor', designation: 'Researcher', initials: 'DR', avatarBg: '#2f68b2' };
      const assignee = task.assigned_user_id ? users.find((u) => u.id === task.assigned_user_id) : null;

      const titleEl = document.getElementById('detail-task-title');
      const catEl = document.getElementById('detail-task-cat');
      const typeEl = document.getElementById('detail-task-type');
      const statusEl = document.getElementById('detail-task-status');
      const creatorEl = document.getElementById('detail-task-creator');
      const deadlineEl = document.getElementById('detail-task-deadline');
      const descEl = document.getElementById('detail-task-desc');
      const reqListEl = document.getElementById('detail-task-requirements');
      const actionAreaEl = document.getElementById('detail-task-action-area');
      const stepperEl = document.getElementById('detail-task-stepper');

      if (titleEl) titleEl.textContent = task.title;
      if (catEl) catEl.textContent = task.category;
      if (typeEl) typeEl.textContent = task.request_type;
      if (statusEl) {
        const statusClass = task.status.toLowerCase().replace(/\s+/g, '-');
        statusEl.className = `task-status-badge status-${statusClass}`;
        statusEl.textContent = task.status;
      }

      if (creatorEl) {
        creatorEl.innerHTML = `
          <div class="author-avatar" style="background: ${creator.avatarBg};">${creator.initials}</div>
          <div>
            <strong>${creator.name}</strong>
            <small>${creator.designation}</small>
          </div>
        `;
      }

      if (deadlineEl) {
        deadlineEl.textContent = formatDate(task.deadline);
      }

      if (descEl) {
        descEl.textContent = task.description;
      }

      // Stepper
      if (stepperEl) {
        const steps = ['Open', 'In Progress', 'Submitted', 'Completed'];
        const currentIdx = steps.indexOf(task.status === 'Revision Requested' ? 'In Progress' : task.status);
        stepperEl.innerHTML = steps
          .map((step, idx) => {
            const isDone = idx <= currentIdx;
            const isCurrent = step === task.status || (task.status === 'Revision Requested' && step === 'In Progress');
            return `
            <div class="stepper-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}">
              <div class="step-circle">${idx + 1}</div>
              <span class="step-label">${step}</span>
            </div>
          `;
          })
          .join('<div class="stepper-line"></div>');
      }

      // Requirements
      if (reqListEl) {
        const reqs = task.requirements || {};
        reqListEl.innerHTML = `
          ${reqs.subject ? `<li><strong>Medical Topic / Field:</strong> ${reqs.subject}</li>` : ''}
          ${reqs.expected_format ? `<li><strong>Expected Format:</strong> ${reqs.expected_format}</li>` : ''}
          ${reqs.referencing_style ? `<li><strong>Referencing Style:</strong> ${reqs.referencing_style}</li>` : ''}
          ${reqs.word_count ? `<li><strong>Scope / Word Count:</strong> ${reqs.word_count}</li>` : ''}
          ${reqs.instructions ? `<li><strong>Specific Instructions:</strong> ${reqs.instructions}</li>` : ''}
          ${
            reqs.expertise && reqs.expertise.length > 0
              ? `<li><strong>Required Skills:</strong> ${reqs.expertise.map((s) => `<span class="skill-tag">${s}</span>`).join(' ')}</li>`
              : ''
          }
        `;
      }

      // Action Area Logic
      if (actionAreaEl) {
        let actionHTML = '';

        if (task.creator_id === activeUser.id) {
          // Current user is the Creator
          if (task.status === 'Submitted') {
            actionHTML = `
              <div class="task-action-box creator-box">
                <div>
                  <strong>Contributor has submitted work for this task!</strong>
                  <p>Review the submitted deliverable documents and notes, then either accept or request revisions.</p>
                </div>
                <button class="button button-primary" id="btn-review-submission-trigger" data-id="${task.id}" type="button">
                  Review Deliverables
                </button>
              </div>
            `;
          } else if (task.status === 'Completed') {
            actionHTML = `
              <div class="task-action-box completed-box">
                <span class="status-check-icon">✓</span>
                <div>
                  <strong>Task Successfully Completed</strong>
                  <p>You approved and accepted the deliverable documents for this task.</p>
                </div>
                <button class="button button-secondary" id="btn-view-completed-work" data-id="${task.id}" type="button">
                  View Completed Deliverables
                </button>
              </div>
            `;
          } else if (task.status === 'In Progress' || task.status === 'Revision Requested') {
            actionHTML = `
              <div class="task-action-box in-progress-box">
                <div>
                  <strong>Assigned to: ${assignee ? assignee.name : 'Contributor'}</strong>
                  <p>The contributor is currently preparing your documents according to the specified guidelines.</p>
                </div>
              </div>
            `;
          } else {
            actionHTML = `
              <div class="task-action-box info-box">
                <p>This task is currently <strong>Open</strong> on the marketplace for qualified contributors.</p>
              </div>
            `;
          }
        } else if (task.assigned_user_id === activeUser.id) {
          // Current user is the Assigned Contributor
          if (task.status === 'In Progress' || task.status === 'Revision Requested') {
            actionHTML = `
              <div class="task-action-box workspace-box">
                <div>
                  <strong>You are assigned to this task!</strong>
                  <p>${task.status === 'Revision Requested' ? 'Author requested modifications. Upload revised documents.' : 'When your work is ready, upload completed deliverable documents here.'}</p>
                </div>
                <button class="button button-primary" id="btn-open-workspace-trigger" data-id="${task.id}" type="button">
                  Open Submission Workspace
                </button>
              </div>
            `;
          } else if (task.status === 'Submitted') {
            actionHTML = `
              <div class="task-action-box info-box">
                <div>
                  <strong>Submission Pending Author Review</strong>
                  <p>Your completed deliverable documents were submitted. You will be notified once the requester reviews them.</p>
                </div>
              </div>
            `;
          } else if (task.status === 'Completed') {
            actionHTML = `
              <div class="task-action-box completed-box">
                <span class="status-check-icon">✓</span>
                <div>
                  <strong>Task Completed & Approved!</strong>
                  <p>The requester accepted your submitted deliverable documents.</p>
                </div>
              </div>
            `;
          }
        } else {
          // General visitor
          if (task.status === 'Open') {
            actionHTML = `
              <div class="task-action-box claim-box">
                <div>
                  <strong>Ready to contribute your expertise?</strong>
                  <p>Claiming this task assigns it to you and moves it to In Progress.</p>
                </div>
                <button class="button button-primary" id="btn-claim-task-trigger" data-id="${task.id}" type="button">
                  I Want to Work on This Task
                </button>
              </div>
            `;
          } else {
            actionHTML = `
              <div class="task-action-box info-box">
                <p>This task has already been claimed by another contributor (${task.status}).</p>
              </div>
            `;
          }
        }

        actionAreaEl.innerHTML = actionHTML;

        // Attach action handlers
        const claimBtn = document.getElementById('btn-claim-task-trigger');
        if (claimBtn) {
          claimBtn.addEventListener('click', () => {
            const res = state.claimTask(task.id);
            if (res.success) {
              showToast('You have successfully claimed this task! Opening your submission workspace...', 'success');
              this.openWorkspaceModal(task.id);
            } else {
              showToast(res.message, 'error');
            }
          });
        }

        const workspaceBtn = document.getElementById('btn-open-workspace-trigger');
        if (workspaceBtn) {
          workspaceBtn.addEventListener('click', () => {
            this.openWorkspaceModal(task.id);
          });
        }

        const reviewBtn = document.getElementById('btn-review-submission-trigger');
        if (reviewBtn) {
          reviewBtn.addEventListener('click', () => {
            this.openReviewModal(task.id);
          });
        }

        const viewCompletedBtn = document.getElementById('btn-view-completed-work');
        if (viewCompletedBtn) {
          viewCompletedBtn.addEventListener('click', () => {
            this.openReviewModal(task.id);
          });
        }
      }

      this.detailsModal.classList.add('open');
    }

    // ==========================================
    // 3. Contributor Workspace & Submission (Upload Deliverable Docs)
    // ==========================================
    initWorkspaceForm() {
      const form = document.getElementById('form-submit-work');
      const dropzone = document.getElementById('workspace-file-dropzone');
      const fileInput = document.getElementById('workspace-file-input');

      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropzone.classList.add('drag-over');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('drag-over');
          if (e.dataTransfer.files) {
            this.handleWorkspaceFilesAdded(e.dataTransfer.files);
          }
        });

        fileInput.addEventListener('change', (e) => {
          if (e.target.files) {
            this.handleWorkspaceFilesAdded(e.target.files);
          }
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const taskId = form.getAttribute('data-task-id');
          const note = document.getElementById('workspace-submission-note').value.trim();

          if (!note && this.attachedFilesSubmit.length === 0) {
            showToast('Please upload completed documents or provide deliverable summary notes.', 'error');
            return;
          }

          const res = state.submitWork(taskId, {
            note,
            files: this.attachedFilesSubmit
          });

          if (res.success) {
            this.workspaceModal.classList.remove('open');
            form.reset();
            this.attachedFilesSubmit = [];
            this.renderWorkspaceFileList();
            showToast('Completed deliverable documents submitted successfully to the requester!', 'success');
            this.openTaskDetailsModal(taskId);
          } else {
            showToast(res.message, 'error');
          }
        });
      }
    }

    handleWorkspaceFilesAdded(files) {
      Array.from(files).forEach((file) => {
        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        const ext = file.name.split('.').pop().toLowerCase();
        this.attachedFilesSubmit.push({
          name: file.name,
          size: sizeFormatted,
          type: ext
        });
      });
      this.renderWorkspaceFileList();
    }

    renderWorkspaceFileList() {
      const fileListEl = document.getElementById('workspace-file-list');
      if (!fileListEl) return;

      if (this.attachedFilesSubmit.length === 0) {
        fileListEl.innerHTML = '';
        return;
      }

      fileListEl.innerHTML = this.attachedFilesSubmit
        .map(
          (f, idx) => `
          <div class="uploaded-file-item">
            <span class="file-icon">📄</span>
            <div class="file-name-size">
              <strong>${f.name}</strong>
              <small>${f.size} • ${f.type.toUpperCase()}</small>
            </div>
            <button type="button" class="btn-remove-submit-file" data-idx="${idx}">&times;</button>
          </div>
        `
        )
        .join('');

      fileListEl.querySelectorAll('.btn-remove-submit-file').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'), 10);
          this.attachedFilesSubmit.splice(idx, 1);
          this.renderWorkspaceFileList();
        });
      });
    }

    openWorkspaceModal(taskId) {
      const task = state.getTasks().find((t) => t.id === taskId);
      if (!task || !this.workspaceModal) return;

      const titleEl = document.getElementById('workspace-task-title');
      const form = document.getElementById('form-submit-work');
      const revisionAlert = document.getElementById('workspace-revision-alert');

      if (titleEl) titleEl.textContent = task.title;
      if (form) form.setAttribute('data-task-id', task.id);

      // Check for active revision
      const activeRevision = task.revisions ? task.revisions.find((r) => r.status === 'Active') : null;
      if (revisionAlert) {
        if (activeRevision) {
          revisionAlert.style.display = 'block';
          revisionAlert.innerHTML = `
            <strong>⚠️ Author Requested Revisions:</strong>
            <p>"${activeRevision.revision_message}"</p>
          `;
        } else {
          revisionAlert.style.display = 'none';
        }
      }

      this.attachedFilesSubmit = [];
      this.renderWorkspaceFileList();

      if (this.detailsModal) this.detailsModal.classList.remove('open');
      this.workspaceModal.classList.add('open');
    }

    // ==========================================
    // 4. Requester Review & Revision Flow (Review Submitted Deliverable Docs)
    // ==========================================
    initReviewActions() {
      const acceptBtn = document.getElementById('btn-review-accept');
      const revisionBtn = document.getElementById('btn-review-request-revision');
      const revisionBox = document.getElementById('review-revision-box');
      const sendRevisionBtn = document.getElementById('btn-send-revision-note');
      const cancelRevisionBtn = document.getElementById('btn-cancel-revision-note');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          const taskId = acceptBtn.getAttribute('data-task-id');
          state.markCompleted(taskId);
          this.reviewModal.classList.remove('open');
          showToast('Task marked as Completed! Deliverable documents accepted.', 'success');
          this.openTaskDetailsModal(taskId);
        });
      }

      if (revisionBtn && revisionBox) {
        revisionBtn.addEventListener('click', () => {
          revisionBox.style.display = 'block';
          revisionBtn.style.display = 'none';
        });
      }

      if (cancelRevisionBtn && revisionBox && revisionBtn) {
        cancelRevisionBtn.addEventListener('click', () => {
          revisionBox.style.display = 'none';
          revisionBtn.style.display = 'inline-flex';
        });
      }

      if (sendRevisionBtn) {
        sendRevisionBtn.addEventListener('click', () => {
          const taskId = sendRevisionBtn.getAttribute('data-task-id');
          const message = document.getElementById('review-revision-message').value.trim();

          if (!message) {
            showToast('Please specify what revisions or changes are required.', 'error');
            return;
          }

          state.requestRevision(taskId, message);
          this.reviewModal.classList.remove('open');
          document.getElementById('review-revision-message').value = '';
          showToast('Revision request sent to contributor.', 'success');
          this.openTaskDetailsModal(taskId);
        });
      }
    }

    openReviewModal(taskId) {
      const task = state.getTasks().find((t) => t.id === taskId);
      if (!task || !this.reviewModal) return;

      const users = state.getUsers();
      const latestSub = task.submissions && task.submissions.length > 0 ? task.submissions[task.submissions.length - 1] : null;
      const contributor = latestSub ? users.find((u) => u.id === latestSub.submitted_by) : null;

      const titleEl = document.getElementById('review-task-title');
      const subInfoEl = document.getElementById('review-submission-meta');
      const subNoteEl = document.getElementById('review-submission-note');
      const subDocsContainer = document.getElementById('review-submitted-files-container');
      const subDocsListEl = document.getElementById('review-submitted-files');
      const acceptBtn = document.getElementById('btn-review-accept');
      const sendRevBtn = document.getElementById('btn-send-revision-note');
      const revisionBox = document.getElementById('review-revision-box');
      const revisionBtn = document.getElementById('btn-review-request-revision');

      if (titleEl) titleEl.textContent = task.title;
      if (acceptBtn) acceptBtn.setAttribute('data-task-id', task.id);
      if (sendRevBtn) sendRevBtn.setAttribute('data-task-id', task.id);
      if (revisionBox) revisionBox.style.display = 'none';
      if (revisionBtn) revisionBtn.style.display = 'inline-flex';

      if (subInfoEl) {
        subInfoEl.innerHTML = `
          <strong>Submitted by:</strong> ${contributor ? contributor.name : 'Contributor'} (${contributor ? contributor.designation : ''}) • 
          <small>${latestSub ? new Date(latestSub.submitted_at).toLocaleString() : ''}</small>
        `;
      }

      if (subNoteEl) {
        subNoteEl.textContent = latestSub ? latestSub.submission_note || 'No notes attached with submission.' : 'No submission recorded.';
      }

      if (subDocsContainer && subDocsListEl) {
        if (latestSub && latestSub.files && latestSub.files.length > 0) {
          subDocsContainer.style.display = 'block';
          subDocsListEl.innerHTML = latestSub.files
            .map(
              (f) => `
            <div class="file-attachment-card">
              <span class="file-icon">📄</span>
              <div class="file-info">
                <strong>${f.name}</strong>
                <small>${f.size} • ${f.type.toUpperCase()}</small>
              </div>
              <button type="button" class="button button-secondary btn-download-sub-doc" data-filename="${f.name}">
                Download Deliverable
              </button>
            </div>
          `
            )
            .join('');

          subDocsListEl.querySelectorAll('.btn-download-sub-doc').forEach((b) => {
            b.addEventListener('click', (e) => {
              showToast(`Downloading submitted deliverable: "${e.target.getAttribute('data-filename')}"`, 'success');
            });
          });
        } else {
          subDocsContainer.style.display = 'none';
        }
      }

      if (this.detailsModal) this.detailsModal.classList.remove('open');
      this.reviewModal.classList.add('open');
    }


  }

  // Initialize UI once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.marketplaceApp = new MarketplaceUI();
  });
})();
