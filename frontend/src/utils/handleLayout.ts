export function getDistributedHandlePercent(index: number, total: number): number {
  return ((index + 1) / (total + 1)) * 100;
}

export function getDistributedHandleStyle(index: number, total: number): { top: string } {
  return { top: `${getDistributedHandlePercent(index, total)}%` };
}
