export function formatterNumber(val, unit) {
  if (unit != "%") {
    const nums = String(val).split(".");
    let num = nums[0];
    const float = nums[1] ? nums[1] : "";
    num = parseInt(num).toLocaleString();
    return num + "." + float;
  } else {
    return val;
  }
}
