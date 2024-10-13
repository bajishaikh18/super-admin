import { getAgenciesList, getJobTitles } from "@/apis/common"

export const getFormattedJobTitles = async (title:string)=>{
    const titles = await getJobTitles(title);
    return titles.map((title:any)=>({
        value: title._id,
        label: title.title
    }))
}

export const getFormattedAgencies = async (name:string)=>{
    const agencies = await getAgenciesList(name);
    return agencies.map((title:any)=>({
        value: title._id,
        label: title.name
    }))
}