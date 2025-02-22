export interface VideoCallInfo {
  platform: string;
  link: string;
  meetingId: string;
  passcode: string;
  joinBeforeHost: boolean;
  agenda?: string[];
}

export interface WorkoutInfo {
  type: string;
  location: string;
  trainer?: string;
  instructor?: string;
  level?: string;
  style?: string;
  equipment?: string[];
  room?: string;
  duration?: number;
  exercises?: Array<{ name: string; sets: number; reps: number | string }>;
  route?: string;
  distance?: string;
  pace?: string;
  weather?: {
    temperature: string;
    condition: string;
    sunset: string;
  };
  training?: {
    week: number;
    goal: string;
    nextMilestone: string;
  };
  notes?: string;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  reservation: {
    time: string;
    confirmation: string;
    partySize: number;
    table?: string;
  };
  menu: string;
  dietaryOptions: string[];
  specialMenu?: string;
  specialRequests?: string;
  parking?: string;
}

export interface MedicalInfo {
  doctor: string;
  specialty: string;
  clinic: string;
  address: string;
  floor: string;
  insurance: string;
  documents: string[];
  parking: string;
  procedures?: string[];
  preAppointment?: string[];
}

export interface PresentationInfo {
  content: string[];
  audience: string;
  duration: string;
  materials: string[];
}

export interface WorkshopInfo {
  materials: string[];
  prerequisites: string[];
  repository: string;
  exercises: string[];
  facilitator?: string;
  room?: string;
  tools?: string[];
}

export interface SocialInfo {
  occasion: string;
  location: string;
  guests: number;
  gifts: string[];
  food: {
    menu: string[];
    dietary: string[];
    responsibilities: string;
  };
}

export interface CodebaseInfo {
  repository: string;
  branch: string;
  pullRequests: string[];
  requiredReviews: number;
}

export interface DesignReviewInfo {
  files: string[];
  feedback: string[];
  tools: string[];
}

export interface DevelopmentInfo {
  repository: string;
  pullRequest: string;
  reviewers: string[];
  changes: string[];
  documentation: string;
  testCoverage: string;
  deployment: {
    environment: string;
    version: string;
    rollback: string;
  };
}

export interface DesignInfo {
  project: string;
  files: string[];
  tools: string[];
  reviewers: string[];
  deliverables: string[];
  prototype: string;
  research: {
    usability: string;
    accessibility: string;
  };
}
