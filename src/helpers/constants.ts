// export const BASE_URL = 'https://ec2-3-110-104-29.ap-south-1.compute.amazonaws.com:3030';
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const COUNTRIES = {
  in: { label: "India", isdCode: "+91" },
  sa: { label: "Saudi Arabia", isdCode: "+966" },
  qa: { label: "Qatar", isdCode: "+974" },
  ae: { label: "United Arab Emrites", isdCode: "+971" },
  om: { label: "Oman", isdCode: "+968" },
  bh: { label: "Bahrain", isdCode: "+973" },
  kw: { label: "Kuwait", isdCode: "+965" },
};

export const IMAGE_BASE_URL =
  "https://wonderlybackendpublic.s3.ap-south-1.amazonaws.com";

export const FACILITIES_IMAGES = {
  Food: "/food.png",
  Transportation: "/transport.png",
  Stay: "/stay.png",
  Recruitment: "/recruit.png",
};

export const INDUSTRIES = {
  software: "Software",
  automotive: "Automotive",
  finance: "Finance",
  manufacturing: "Manufacturing",
  healthcare: "Healthcare",
};

export const ROLE = {
  superAdmin: 1,
  admin: 2,
  employer: 3,
  user: 4,
};
