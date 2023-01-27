const User = require("../../../models/user");
const { uploadUserAvatarController } = require("../../../controller/files");

describe("Test files controller", () => {
  let mUser, mReq, mRes, mNext, findByIdServiceSpy;

  beforeEach(() => {
    mUser = {
      _id: "63c3fe510ecf57dade39f3eb",
      password: "$2a$10$9TRUf0jRxkLgAv55smmvXuKoqAbZ5xgXpSqAnkAHmOKvE6FCOxhZi",
      save: jest.fn(() => mUser),
      userData: jest.fn(() => mUser),
    };
    mReq = {
      headers: {
        authorization: `Bearer `,
      },
      body: {
        email: "replex@gmail.com",
        password: "1333444",
      },
      owner: {},
      get: jest.fn(),
      protocol: "http",
    };
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn();
    findByIdServiceSpy = User["findById"] = jest.fn(() => mUser);
  });
  test("should uploadUserAvatarController save avatar", async () => {
    await uploadUserAvatarController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toBeCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(mUser);
    expect(mReq.avatarURL).toBe();
    expect(mUser.save).toBeCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should uploadUserAvatarController call 401 response if user not found", async () => {
    const findByIdServiceSpy = (User["findById"] = jest.fn(() => null));
    await uploadUserAvatarController(mReq, mRes, mNext);

    await expect(findByIdServiceSpy).toBeCalled();
    expect(findByIdServiceSpy).toHaveReturnedWith(null);
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should uploadUserAvatarController catch Error without params", async () => {
    try {
      await uploadUserAvatarController(mReq, mRes, mNext);
      throw new Error();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
