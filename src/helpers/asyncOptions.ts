import { getAgenciesList, getJobTitles } from "@/apis/common"

export const getFormattedJobTitles = async (title:string)=>{
    const titles = await getJobTitles(title);
    return titles.map((title:any)=>({
        value: title._id,
        label: title.title
    }))
}

export const getFormattedAgencies = async (name:string,addImage?:boolean)=>{
    const agencies = await getAgenciesList(name);
    return agencies.map((title:any)=>({
        value: title._id,
        label: title.name,
        image: addImage ? title.profilePic || '/no_image.jpg' : undefined,
        hasImage: !!title.profilePic
    }))
}