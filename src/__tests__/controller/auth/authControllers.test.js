const User = require("../../../service/schemas/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
} = require("../../../controller/auth");

describe("Test auth controllers", () => {
  let token;
  let mUser;
  let mReq;
  let mRes;
  let mNext;
  let createUserServiceSpy;
  let findOneServiceSpy;
  let findByIdServiceSpy;
  let findOneAndUpdateServiceSpy;

  beforeEach(() => {
    token = jwt.sign(
      { _id: "63c3fe510ecf57dade39f3eb" },
      process.env.JWT_SECRET
    );
    mUser = {
      _id: "63c3fe510ecf57dade39f3eb",
      password: "$2a$10$9TRUf0jRxkLgAv55smmvXuKoqAbZ5xgXpSqAnkAHmOKvE6FCOxhZi",
      token,
      save: jest.fn(() => mUser),
      userData: jest.fn(() => ({
        email: "replex@gmail.com",
        subscription: "starter",
      })),
    };
    mReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        email: "replex@gmail.com",
        password: "1333444",
      },
      owner: {},
    };
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn(() => {});

    createUserServiceSpy = User["create"] = jest.fn(() => mUser);
    findOneServiceSpy = User["findOne"] = jest.fn(() => mUser);
    findByIdServiceSpy = User["findById"] = jest.fn(() => mUser);
    findOneAndUpdateServiceSpy = User["findOneAndUpdate"] = jest.fn(
      () => mUser
    );
  });

  test("should registrationController create new user", async () => {
    await registrationController(mReq, mRes, mNext);

    await expect(createUserServiceSpy).toBeCalled();
    expect(createUserServiceSpy).toHaveReturnedWith(mUser);
    expect(mUser.avatarURL).toBeDefined();
    expect(mUser.save).toBeCalled();
    expect(mRes.status).toHaveBeenCalledWith(201);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should loginController return token", async () => {
    mUser.token = "";
    const result = await loginController(mReq, mRes, mNext);

    await expect(findOneServiceSpy).toBeCalled();
    expect(mUser.save).toBeCalled();
    expect(mUser.token).toBeDefined();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalled();
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe("string");
    expect(typeof result.user).toBe("object");
    expect(typeof result.user.email).toBe("string");
    expect(typeof result.user.subscription).toBe("string");
  });

  test("should loginController call 401 response if user not found", async () => {
    const findOneServiceSpy = (User["findOne"] = jest.fn(() => null));
    await loginController(mReq, mRes, mNext);

    await expect(findOneServiceSpy).toBeCalled();
    expect(findOneServiceSpy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should loginController call 401 response if wrong password", async () => {
    mReq.body.password = "111";
    await loginController(mReq, mRes, mNext);

    await expect(findOneServiceSpy).toBeCalled();
    expect(findOneServiceSpy).toHaveReturnedWith(mUser);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should loginController catch Error without params", async () => {
    try {
      await loginController();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("should logOutController clean token", async () => {
    mReq.owner._id = "63c3fe510ecf57dade39f3eb";
    await logOutController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toBeCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(mUser);
    expect(mReq.token).toBeFalsy();
    expect(mUser.save).toBeCalled();
    expect(mRes.status).toHaveBeenCalledWith(204);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should logOutController call 401 response if user not found ", async () => {
    const findByIdServiceSpy = (User["findById"] = jest.fn(() => null));
    await logOutController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toBeCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should logOutController catch Error without params", async () => {
    try {
      await logOutController();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("should currentUserController return userData", async () => {
    mReq.owner._id = "63c3fe510ecf57dade39f3eb";
    await currentUserController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toHaveBeenCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(mUser);
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should currentUserController call 401 response if user not found", async () => {
    const findByIdServiceSpy = (User["findById"] = jest.fn(() => null));
    await currentUserController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toBeCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should currentUserController catch Error without params", async () => {
    try {
      await currentUserController();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test("should updateUserStatusController update user", async () => {
    mReq.owner._id = "63c3fe510ecf57dade39f3eb";
    await updateUserStatusController(mReq, mRes, mNext);

    await expect(findOneAndUpdateServiceSpy).toBeCalled();
    expect(findOneAndUpdateServiceSpy).toHaveReturnedWith(mUser);
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should updateUserStatusController call 401 response if user not found", async () => {
    const findOneAndUpdateServiceSpy = (User["findOneAndUpdate"] = jest.fn(
      () => null
    ));
    await updateUserStatusController(mReq, mRes, mNext);

    await expect(findOneAndUpdateServiceSpy).toBeCalled();
    expect(findOneAndUpdateServiceSpy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should updateUserStatusController catch Error without params", async () => {
    try {
      await updateUserStatusController();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
