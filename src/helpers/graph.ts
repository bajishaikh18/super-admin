export function getGradient(ctx: any, chartArea: any, direction:any) {
  let width, gradient, height;
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    if(direction === "vertical"){
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    }else{
        gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    }
    gradient.addColorStop(1, "rgba(0, 69, 230, 1)");
    gradient.addColorStop(0, "rgba(183, 182, 252, 1)");
  }

  return gradient;
}
