const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");
jest.mock("@sendgrid/mail");

const {
  tryCatchWrap,
  errorHandler,
  wrongPathHandler,
  sendVerificationEmail,
} = require("../../helpers");

describe("Test tryCatchWrap function", () => {
  const mReq = jest.fn(() => {});
  const mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
  const mNext = jest.fn(() => {});
  test("should tryCatchWrap will return function", () => {
    const result = tryCatchWrap(mReq, mRes, mNext);
    expect(typeof result).toBe("function");
  });

  test("should tryCatchWrap catch Error and call Next without params ", () => {
    try {
      tryCatchWrap();
    } catch (error) {
      expect(mNext).toBeCalled();
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe("Test errorHandler function", () => {
  let err, mReq, mRes, mNext;

  beforeEach(() => {
    (err = new Error()), (mReq = jest.fn(() => {}));
    mReq = jest.fn();
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn(() => {});
  });

  test("should call 400 response if validation error", () => {
    err.name = "ValidationError";
    errorHandler(err, mReq, mRes, mNext);
    expect(err).toBeInstanceOf(Error);
    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should call 400 response if cast error", () => {
    err.name = "CastError";
    errorHandler(err, mReq, mRes, mNext);
    expect(err).toBeInstanceOf(Error);
    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should call 409 response duplicate email", () => {
    err.code = 11000;
    errorHandler(err, mReq, mRes, mNext);
    expect(err).toBeInstanceOf(Error);
    expect(mRes.status).toHaveBeenCalledWith(409);
    expect(mRes.json).toHaveBeenCalled();
  });

  test("should call 500 response if other error", () => {
    errorHandler(err, mReq, mRes, mNext);
    expect(err).toBeInstanceOf(Error);
    expect(mRes.status).toHaveBeenCalled();
    expect(mRes.json).toHaveBeenCalled();
  });
});

describe("Test wrong path error", () => {
  let mReq, mRes, mNext;

  beforeEach(() => {
    mReq = jest.fn();
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn(() => {});
  });

  test("should call 404 response if other error", () => {
    wrongPathHandler(mReq, mRes, mNext);
    expect(mRes.status).toHaveBeenCalledWith(404);
    expect(mRes.json).toHaveBeenCalled();
  });
});

describe("Test verification email sending", () => {
  const mReq = {
    body: {
      email: "replex@gmail.com",
    },
    get: jest.fn(),
  };
  const verificationToken = nanoid();
  test("should send email", async () => {
    await sendVerificationEmail(mReq, verificationToken);
    expect(sgMail.setApiKey).toBeCalled();
    expect(sgMail.send).toBeCalled();
  });

  test("should catch Error if email doesn`t send", async () => {
    try {
      await sendVerificationEmail();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
