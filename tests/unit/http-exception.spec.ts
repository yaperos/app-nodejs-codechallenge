import HttpException from "../../src/common/http-exception";

describe("Unit test: Class HttpException", () => {
  const error = new HttpException(404, "Not found");

  it("should extends from Error class", () => {
    expect(error instanceof Error).toEqual(true);
  });

  it("should have a status 404", () => {
    expect(error.statusCode).toEqual(404);
  });
});