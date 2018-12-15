import Mock from "mockjs";

Mock.Random.extend({
  timefix() {
    const time = new Date();
    const hour = time.getHours();
    return hour < 9
      ? "早上好"
      : hour <= 11
        ? "上午好"
        : hour <= 13
          ? "中午好"
          : hour <= 20
            ? "下午好"
            : "晚上好";
  }
});

Mock.mock("/login", "post", ({ body }) => {
  let result = {};
  const { name, password } = JSON.parse(body);

  if (name !== "admin" || password !== "123456") {
    result.code = -1;
    result.message = "Accout or passord error.(admin/123456)";
  } else {
    result.code = 0;
    result.message = `${Mock.mock("@TIMEFIX") + Mock.mock("@ADMIN")}，欢迎回来`;
  }
  return result;
});

Mock.mock("/user", "get", () => {
  let result = {};

  result.code = 0;
  result.data = Mock.mock({
    name: "@name"
  });
  return result;
});
