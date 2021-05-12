function arrayMove(x: any[], from: number, to: number) {
  x.splice(to < 0 ? x.length + to : to, 0, x.splice(from, 1)[0]);
}

export default function moveToNewArrayPosition(
  arr: any[],
  from: number,
  to: number
) {
  const list = arr.slice(0);
  arrayMove(list, from, to);
  return list;
}
