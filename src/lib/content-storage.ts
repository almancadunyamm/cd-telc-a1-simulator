import type {
  ContentStore,
  ExamDefinition,
  PackageDefinition,
} from "@/src/types/content";

const STORAGE_KEY = "telc_content_store";

const defaultStore: ContentStore = {
  exams: [],
  packages: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getContentStore(): ContentStore {
  if (!isBrowser()) return defaultStore;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    return defaultStore;
  }

  try {
    return JSON.parse(raw) as ContentStore;
  } catch (error) {
    console.error("Content store parse error:", error);
    return defaultStore;
  }
}

export function saveContentStore(store: ContentStore) {
  if (!isBrowser()) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ==========================
// EXAM ACTIONS
// ==========================

export function getExams(): ExamDefinition[] {
  return getContentStore().exams;
}

export function getExamById(examId: string): ExamDefinition | null {
  const store = getContentStore();
  return store.exams.find((e) => e.id === examId) || null;
}

export function saveExam(exam: ExamDefinition) {
  const store = getContentStore();

  const existingIndex = store.exams.findIndex((e) => e.id === exam.id);

  if (existingIndex !== -1) {
    store.exams[existingIndex] = exam;
  } else {
    store.exams.push(exam);
  }

  saveContentStore(store);
}

export function updateExam(exam: ExamDefinition) {
  saveExam(exam);
}

export function deleteExam(examId: string) {
  const store = getContentStore();

  store.exams = store.exams.filter((e) => e.id !== examId);

  saveContentStore(store);
}

// ==========================
// PACKAGE ACTIONS
// ==========================

export function getPackages(): PackageDefinition[] {
  return getContentStore().packages;
}

export function savePackage(pkg: PackageDefinition) {
  const store = getContentStore();

  const existingIndex = store.packages.findIndex((p) => p.id === pkg.id);

  if (existingIndex !== -1) {
    store.packages[existingIndex] = pkg;
  } else {
    store.packages.push(pkg);
  }

  saveContentStore(store);
}

export function deletePackage(packageId: string) {
  const store = getContentStore();

  store.packages = store.packages.filter((p) => p.id !== packageId);

  saveContentStore(store);
}