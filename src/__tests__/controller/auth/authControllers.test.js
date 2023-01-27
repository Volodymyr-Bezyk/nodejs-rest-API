require("dotenv").config();
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const { sendVerificationEmail } = require("../../../helpers");

const {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
  verifyUserController,
  repeatedVerification,
} = require("../../../controller/auth");

jest.mock("../../../helpers", () => {
  const original = jest.requireActual("../../../helpers");
  return {
    ...original,
    sendVerificationEmail: jest.fn(() => console.log("HELLO")),
  };
});

describe("Test auth controllers", () => {
  let e,
    token,
    mUser,
    mReq,
    mRes,
    mNext,
    createUserServiceSpy,
    findOneServiceSpy,
    findByIdServiceSpy,
    findOneAndUpdateServiceSpy;

  beforeEach(() => {
    token = jwt.sign(
      { _id: "63c3fe510ecf57dade39f3eb" },
      process.env.JWT_SECRET
    );
    mUser = {
      _id: "63c3fe510ecf57dade39f3eb",
      password: "$2a$10$9TRUf0jRxkLgAv55smmvXuKoqAbZ5xgXpSqAnkAHmOKvE6FCOxhZi",
      token,
      verify: false,
      verificationToken: "",
      save: jest.fn(() => mUser),
      userData: jest.fn(() => ({
        email: "replex@gmail.com",
        subscription: "starter",
      })),
      params: {
        verificationToken: "",
      },
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
      get: jest.fn(),
      params: { verificationToken: nanoid() },
    };
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn(() => {});

    createUserServiceSpy = User.create = jest.fn(() => mUser);
    findOneServiceSpy = User.findOne = jest.fn(() => mUser);
    findByIdServiceSpy = User.findById = jest.fn(() => mUser);
    findOneAndUpdateServiceSpy = User.findOneAndUpdate = jest.fn(() => mUser);
    sendVerificationEmail.mockImplementation();
  });

  describe("Test registration controller", () => {
    test("should registrationController create new user", async () => {
      await registrationController(mReq, mRes, mNext);

      expect(mReq.body.verificationToken).toBeDefined();
      expect(createUserServiceSpy).toHaveBeenCalled();
      expect(createUserServiceSpy).toHaveReturnedWith(mUser);
      expect(mUser.avatarURL).toBeDefined();
      expect(mUser.save).toHaveBeenCalled();
      expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mRes.status).toHaveBeenCalledWith(201);
      expect(mRes.json).toHaveBeenCalled();
    });
  });

  describe("Test verification controller", () => {
    test("should the verification will be successfull", async () => {
      await verifyUserController(mReq, mRes, mNext);

      expect(mReq.params.verificationToken).toBeDefined();
      expect(findOneAndUpdateServiceSpy).toHaveBeenCalled();
      expect(mUser.verificationToken).toBe("-");
      expect(mUser.save).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should the verification will be failed with 404 response if user not found", async () => {
      const findOneAndUpdateServiceSpy = (User.findOneAndUpdate = jest.fn(
        () => null
      ));
      await verifyUserController(mReq, mRes, mNext);

      expect(mReq.params.verificationToken).toBeDefined();
      expect(findOneAndUpdateServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });
  });

  describe("Test re-verification controller", () => {
    test("should re-verification will be successfull", async () => {
      await repeatedVerification(mReq, mRes, mNext);

      expect(mReq.body.email).toBeDefined();
      expect(findOneServiceSpy).toHaveBeenCalled();
      expect(sendVerificationEmail).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should re-verification will be failed with 400 response if email doesn`t exist", async () => {
      mReq.body.email = "";

      await repeatedVerification(mReq, mRes, mNext);
      expect(mReq.body.email).toBeFalsy();
      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should re-verification will be failed with 404 response if user not found", async () => {
      const findOneServiceSpy = (User.findOne = jest.fn(() => null));
      await repeatedVerification(mReq, mRes, mNext);

      expect(mReq.body.email).toBeDefined();
      await expect(findOneServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should re-verification will be failed with 400 response if user already verificated", async () => {
      mUser.verify = true;
      await repeatedVerification(mReq, mRes, mNext);

      expect(mReq.body.email).toBeDefined();
      expect(findOneServiceSpy).toHaveBeenCalled();
      expect(mUser.verify).toBe(true);
      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.json).toHaveBeenCalled();
    });
  });

  describe("Test login controller", () => {
    test("should loginController return token", async () => {
      mUser.token = "";
      mUser.verify = true;
      const result = await loginController(mReq, mRes, mNext);

      expect(findOneServiceSpy).toHaveBeenCalled();
      expect(mUser.save).toHaveBeenCalled();
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
      const findOneServiceSpy = (User.findOne = jest.fn(() => null));
      await loginController(mReq, mRes, mNext);

      expect(findOneServiceSpy).toHaveBeenCalled();
      expect(findOneServiceSpy).toHaveReturnedWith(null);
      expect(mRes.status).toHaveBeenCalledWith(401);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should loginController call 401 response if wrong password", async () => {
      mReq.body.password = "111";
      await loginController(mReq, mRes, mNext);

      expect(findOneServiceSpy).toHaveBeenCalled();
      expect(findOneServiceSpy).toHaveReturnedWith(mUser);
      expect(mRes.status).toHaveBeenCalledWith(401);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should loginController catch Error without params", async () => {
      try {
        await loginController();
      } catch (error) {
        e = error;
      } finally {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test logout controller", () => {
    test("should logOutController clean token", async () => {
      mReq.owner._id = "63c3fe510ecf57dade39f3eb";
      await logOutController(mReq, mRes, mNext);

      expect(findByIdServiceSpy).toHaveBeenCalled();
      expect(findByIdServiceSpy).toHaveReturnedWith(mUser);
      expect(mReq.token).toBeFalsy();
      expect(mUser.save).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(204);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should logOutController call 401 response if user not found", async () => {
      const findByIdServiceSpy = (User.findById = jest.fn(() => null));
      await logOutController(mReq, mRes, mNext);

      expect(findByIdServiceSpy).toHaveBeenCalled();
      expect(findByIdServiceSpy).toHaveReturnedWith(null);
      expect(mRes.status).toHaveBeenCalledWith(401);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should logOutController catch Error without params", async () => {
      try {
        await logOutController();
      } catch (error) {
        e = error;
      } finally {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test current user controller", () => {
    test("should currentUserController return userData", async () => {
      mReq.owner._id = "63c3fe510ecf57dade39f3eb";
      await currentUserController(mReq, mRes, mNext);

      expect(findByIdServiceSpy).toHaveBeenCalled();
      expect(findByIdServiceSpy).toHaveReturnedWith(mUser);
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should currentUserController call 401 response if user not found", async () => {
      const findByIdServiceSpy = (User.findById = jest.fn(() => null));
      await currentUserController(mReq, mRes, mNext);

      expect(findByIdServiceSpy).toHaveBeenCalled();
      expect(findByIdServiceSpy).toHaveReturnedWith(null);
      expect(mRes.status).toHaveBeenCalledWith(401);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should currentUserController catch Error without params", async () => {
      try {
        await currentUserController();
      } catch (error) {
        e = error;
      } finally {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test update User status controller", () => {
    test("should updateUserStatusController update user", async () => {
      mReq.owner._id = "63c3fe510ecf57dade39f3eb";
      await updateUserStatusController(mReq, mRes, mNext);

      expect(findOneAndUpdateServiceSpy).toHaveBeenCalled();
      expect(findOneAndUpdateServiceSpy).toHaveReturnedWith(mUser);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should updateUserStatusController call 401 response if user not found", async () => {
      const findOneAndUpdateServiceSpy = (User.findOneAndUpdate = jest.fn(
        () => null
      ));
      await updateUserStatusController(mReq, mRes, mNext);

      expect(findOneAndUpdateServiceSpy).toHaveBeenCalled();
      expect(findOneAndUpdateServiceSpy).toHaveReturnedWith(null);
      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should updateUserStatusController catch Error without params", async () => {
      try {
        await updateUserStatusController();
      } catch (error) {
        e = error;
      } finally {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
