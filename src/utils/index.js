function formatterNumber(val, unit) {
  if (val === null) {
    return val;
  }

  if (unit != "%") {
    const nums = String(val).split(".");
    let num = nums[0];
    const float = nums[1] ? "." + nums[1] : "";
    num = parseInt(num).toLocaleString();
    return num + float;
  } else {
    return val;
  }
}
function resetNumber(val, unit) {
  console.log(val);
  if (unit != "%") {
    if (typeof val == "string") {
      var str = val.replace(/,/g, "");
      return parseFloat(str);
    } else {
      return val;
    }
  } else {
    return val;
  }
}
export { formatterNumber, resetNumber };
