import { generateExperienceRanges } from "./experience";

// export const BASE_URL = 'https://ec2-3-110-104-29.ap-south-1.compute.amazonaws.com:3030';
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||"https://boon-backend-public-dev.s3.ap-south-1.amazonaws.com"
export const COUNTRIES = {
  in: { label: "India", isdCode: "+91" },
  sa: { label: "Saudi Arabia", isdCode: "+966" },
  qa: { label: "Qatar", isdCode: "+974" },
  ae: { label: "United Arab Emrites", isdCode: "+971" },
  om: { label: "Oman", isdCode: "+968" },
  bh: { label: "Bahrain", isdCode: "+973" },
  kw: { label: "Kuwait", isdCode: "+965" },
};


  
export const FACILITIES_IMAGES = {
  Food: "/food.png",
  Transportation: "/transport.png",
  Stay: "/stay.png",
  Recruitment: "/recruit.png",
};

export const INDUSTRIES = {
  oil_gas: "Oil & Gas",
  constructions: "Constructions",
  facility_management: "Facility Management / Operations Maintenance",
  hospitality: "Hospitality",
  manufacturing: "Manufacturing",
  logistics: "Logistics & E-Commerce",
  health_care:"Health Care",
  information_technology:"Information Technology",
  education:"Education",
  travel_tourism:"Travel & Tourism",
  tele_communication:"Tele Communication",
  banking_finance:"Banking & Finance",
  fcmg:"FMCG",
  retail:"Retail"
};

export const ROLE = {
  superAdmin: 1,
  admin: 2,
  employer: 3,
  user: 4,
};

export const YEARS_OF_EXPERIENCE_LABELS = generateExperienceRanges(1,10);
export const DURATION_OPTIONS: {
  value: string;
  label: string;
}[] = [
  { value: "0", label: "This Month" },
  { value: "1", label: "Last Month" },
  { value: "3", label: "Last 3 months" },
  { value: "6", label: "Last 6 months" },
  { value: "custom", label: "Custom date range" },
];