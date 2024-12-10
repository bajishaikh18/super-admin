export function generateExperienceRanges(rangeStep: number, steps: number): Array<{ value: string; label: string }> {
    const ranges: Array<{ value: string; label: string }> = [];
    
   
    for (let i = 0; i < steps - 1; i++) {
      const start = i;
      const end = start + 1;
      ranges.push({
        value: `${start}`, 
        label: `${start}-${end} Years`, 
      });
    }
    
  
    ranges.push({
      value: `${steps - 1}`, 
      label: `${steps - 1}+ Years`, 
    });
  
    return ranges;
  }