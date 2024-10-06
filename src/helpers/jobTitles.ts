import { getJobTitles } from "@/apis/common"

export const getFormattedJobTitles = async ()=>{
    const titles = await getJobTitles();
    return titles.map((title:any)=>({
        value: title._id,
        label: title.title
    }))
}