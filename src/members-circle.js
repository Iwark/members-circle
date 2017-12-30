const defaultOptions = {
  space: 8,
}

let g_params;

export const render = (area, args) => {
  const items = area.children;
  if(!items || items.length <= 0) return;

  g_params = Object.assign({}, defaultOptions, args, {});
  g_params.items   = items;
  g_params.area_r  = area.clientWidth / 2;
  g_params.item_r  = items[0].clientWidth / 2 + g_params.space;
  g_params.assigns = _assigns(_max_counts(g_params.area_r), items.length);
  _render(g_params.area_r, 0);
}

const _render = (area_r, current) => {
  const max = _max_count(area_r);
  if(max <= 0) {
    return;
  }
  let num = 0;
  for(let i = 0; i<current; i++) {
    num += g_params.assigns[i];
  }
  const count = g_params.assigns[current];
  const deg = 360.0 / count;
  const rad = (deg*Math.PI/180.0);
  const r = area_r - g_params.item_r;
  for(let i = num; i < num+count; i++) {
    const elm = g_params.items[i];
    const x = Math.cos(rad * i) * r + g_params.area_r - g_params.item_r + g_params.space;
    const y = Math.sin(rad * i) * r + g_params.area_r - g_params.item_r + g_params.space;
    elm.style.left = x + "px";
    elm.style.top = y + "px";
  }
  _render(area_r - g_params.item_r*2, current + 1);
}

const _max_counts = (area_r, ary) => {
  if(!ary) ary = [];
  if(area_r <= g_params.item_r) {
    return ary;
  }
  ary.push(_max_count(area_r));
  return _max_counts(area_r-g_params.item_r*2, ary);
}

const _max_count = (area_r) => {
  return parseInt(Math.PI * (area_r - g_params.item_r) / g_params.item_r, 10);
}

const _assigns = (max_counts, counts) => {
  let max_count = 0;
  for(let i=0; i<max_counts.length; i++) {
    max_count += max_counts[i];
  }

  let results = [];
  let total = 0;
  for(let i=0; i<max_counts.length-1; i++) {
    const t = parseInt(1.0 * max_counts[i] / max_count * counts, 10);
    total += t;
    results.push(t);
  }
  results.push(counts - total);
  return results;
}
