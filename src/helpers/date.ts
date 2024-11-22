import { DateTime } from "luxon";

export const getStartAndEndDate = (value:number)=>{
    if(!value && value != 0){
        return '';
    }
    const currentDate  = DateTime.now();
    const startDate = currentDate.minus({month:value}).startOf('month').toISO();
    const endDate = currentDate.minus({month:value === 0 ? 0 : 1}).endOf('month').toISO();
    return `${startDate}&${endDate}`;
}