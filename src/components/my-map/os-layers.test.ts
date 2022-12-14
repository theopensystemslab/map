import { constructURL } from "./os-layers";

describe("constructURL helper function", () => {
  test("simple URL construction", () => {
    const result = constructURL(
      "https://www.test.com",
      "/my-path/to-something"
    );
    expect(result).toEqual("https://www.test.com/my-path/to-something");
  });

  test("URL with query params construction", () => {
    const result = constructURL(
      "https://www.test.com",
      "/my-path/to-something",
      { test: "params", test2: "more-params" }
    );
    expect(result).toEqual(
      "https://www.test.com/my-path/to-something?test=params&test2=more-params"
    );
  });
});
