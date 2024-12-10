export function generateExperienceRanges(rangeStep: number, steps: number): Array<{ value: string; label: string }> {
    const ranges: Array<{ value: string; label: string }> = [];
    for (let i = 0; i < steps; i++) {
      const start = i * rangeStep;
      const end = start + rangeStep;
      ranges.push({
        value: `${start}`, 
        label: `${start}-${end} Years`, 
      });
    }
    return ranges;
  }
  