const { checkJwt } = require("../../middlewares/checkJWT");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
require("dotenv").config();

describe("Test checkJWT Middleware with correct params", () => {
  const token = jwt.sign(
    { _id: "63c3fe510ecf57dade39f3eb" },
    process.env.JWT_SECRET
  );
  const mUser = {
    _id: "63c3fe510ecf57dade39f3eb",
    password: "$2a$10$9TRUf0jRxkLgAv55smmvXuKoqAbZ5xgXpSqAnkAHmOKvE6FCOxhZi",
    token,
  };
  const mReq = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: {
      password: "1333444",
    },
  };
  const mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
  const mNext = jest.fn();
  let spy;

  beforeEach(async () => {
    spy = User["findById"] = jest.fn(() => mUser);
    await checkJwt(mReq, mRes, mNext);
  });

  test("should token exist, match with decoded token in request and next function called ", async () => {
    expect(mReq.headers.authorization).toBeTruthy();
    expect(mReq.headers.authorization.split(" ")[1]).toBeDefined();
    expect(spy).toHaveBeenCalled();
    await expect(spy).toHaveReturnedWith(mUser);
    expect(mReq.owner).toBeDefined();
    expect(mReq.owner._id).toMatch(mUser._id);
    expect(mNext).toHaveBeenCalled();
  });
});

describe("Test checkJWT Middleware with bad params", () => {
  const token = jwt.sign(
    { _id: "63c3fe510ecf57dade39f3eb" },
    process.env.JWT_SECRET
  );
  const mUser = {
    _id: "63c3fe510ecf57dade39f3eb",
    password: "$2a$10$9TRUf0jRxkLgAv55smmvXuKoqAbZ5xgXpSqAnkAHmOKvE6FCOxhZi",
    token: "",
  };

  const mReq = {
    headers: {},
    body: {
      password: "1333444",
    },
  };
  const mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
  const mNext = jest.fn();
  const noAuthorizedResponse = { message: "Not authorized" };

  test("should call 401 response without header authorization", async () => {
    await checkJwt(mReq, mRes, mNext);

    expect(mReq.headers.authorization).toBeFalsy();
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
    expect(mRes.json).toHaveReturnedWith(noAuthorizedResponse);
    expect(mReq.owner).toBeFalsy();
    expect(mNext).not.toHaveBeenCalled();
  });
  test("should call 401 response without token", async () => {
    mReq.headers.authorization = token;
    await checkJwt(mReq, mRes, mNext);

    expect(mReq.headers.authorization).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBeFalsy();
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
    expect(mRes.json).toHaveReturnedWith(noAuthorizedResponse);
    expect(mReq.owner).toBeFalsy();
    expect(mNext).not.toHaveBeenCalled();
  });

  test("should call 401 response when user token and decoded token not equal", async () => {
    mReq.headers.authorization = `Bearer ${token}abc`;
    await checkJwt(mReq, mRes, mNext);

    expect(mReq.headers.authorization).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).not.toBe(mUser.token);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
    expect(mRes.json).toHaveReturnedWith(noAuthorizedResponse);
    expect(mReq.owner).toBeFalsy();
    expect(mNext).not.toHaveBeenCalled();
  });

  test("should call 401 response when user not found", async () => {
    mReq.headers.authorization = `Bearer ${token}`;
    const spy = jest.spyOn(User, "findById").mockImplementationOnce(() => null);
    await checkJwt(mReq, mRes, mNext);

    expect(mReq.headers.authorization).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBe(token);
    await expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
    expect(mRes.json).toHaveReturnedWith(noAuthorizedResponse);
    expect(mReq.owner).toBeFalsy();
    expect(mNext).not.toHaveBeenCalled();
  });

  test("should call 401 response when token not equal user token", async () => {
    mReq.headers.authorization = `Bearer ${token}`;
    const spy = (User["findById"] = jest.fn(() => mUser));
    await checkJwt(mReq, mRes, mNext);

    expect(mReq.headers.authorization).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBeDefined();
    expect(mReq.headers.authorization.split(" ")[1]).toBe(token);
    await expect(spy).toHaveBeenCalled();
    expect(spy).toHaveReturnedWith(mUser);
    expect(mUser.token).not.toBe(token);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
    expect(mRes.json).toHaveReturnedWith(noAuthorizedResponse);
    expect(mNext).not.toBeCalled();
  });
});

describe("Test checkJWT Middleware with Error", () => {
  const mReq = {};
  const mRes = {};
  const mNext = jest.fn();

  beforeAll(async () => {
    await checkJwt(mReq, mRes, mNext);
  });
  test("should catch Error without params and call next function", async () => {
    try {
    } catch (error) {
      expect(mNext).toHaveBeenCalledWith(error);
      expect(error).toBeInstanceOf(Error);
    }
  });
});
