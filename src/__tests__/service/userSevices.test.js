const User = require("../../service/schemas/user");
const {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
} = require("../../service/auth");

describe("Test User services with error", () => {
  let createMethodSpy;
  let findOneMethodSpy;
  let findByIdMethodSpy;
  let findOneAndUpdateMethodSpy;

  beforeEach(() => {
    createMethodSpy = User["create"] = jest.fn(() => {
      throw new Error();
    });
    findOneMethodSpy = User["findOne"] = jest.fn(() => {
      throw new Error();
    });
    findByIdMethodSpy = User["findById"] = jest.fn(() => {
      throw new Error();
    });
    findOneAndUpdateMethodSpy = User["findOneAndUpdate"] = jest.fn(() => {
      throw new Error();
    });
  });

  test("should registerUser catch Error ", async () => {
    try {
      await registerUser();

      await expect(createMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });
  test("should loginUser catch Error ", async () => {
    try {
      await loginUser();

      await expect(findOneMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });
  test("should findUser catch Error ", async () => {
    try {
      await findUser();

      await expect(findByIdMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should updateUserStatus catch Error ", async () => {
    try {
      await updateUserStatus();

      await expect(findOneAndUpdateMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });
});
