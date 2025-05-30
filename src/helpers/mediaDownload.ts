import { getDownloadUrl } from "@/apis/common"
import toast from "react-hot-toast";

export const downloadMedia = async (key:string,name:string)=>{
    const loading = toast.loading("Creating secured download link")
    try{
        const resp = await getDownloadUrl(key,'attachment')
        const link = document.createElement("a");
        link.href = resp.downloadUrl;
        link.target="_blank";
        link.setAttribute('download', `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.dismiss(loading);
        toast.success("Resume downloaded successfully")
    }catch{
        toast.dismiss(loading);
        toast.error("Something went wrong while creating a secured download link")
    }   
}