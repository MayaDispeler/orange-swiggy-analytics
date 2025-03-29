/**
 * Creates a gradient fill for charts
 */
export const getGradient = (
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number },
  startColor: string,
  endColor: string
) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, endColor);
  gradient.addColorStop(1, startColor);
  return gradient;
}; 