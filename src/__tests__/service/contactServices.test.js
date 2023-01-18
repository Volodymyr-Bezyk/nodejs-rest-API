const Contact = require("../../service/schemas/contact");
const {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  replaceContact,
  updateStatusContact,
} = require("../../service/api");

describe("Test Api services with Error", () => {
  let findMethodSpy;
  let findOneMethodSpy;
  let createMethodSpy;
  let findOneAndRemoveMethodSpy;
  let findOneAndReplaceMethodSpy;
  let updateStatusContactReplaceMethodSpy;

  beforeEach(() => {
    findMethodSpy = Contact["find"] = jest.fn(() => {
      throw new Error();
    });
    findOneMethodSpy = Contact["findOne"] = jest.fn(() => {
      throw new Error();
    });
    createMethodSpy = Contact["create"] = jest.fn(() => {
      throw new Error();
    });
    findOneAndRemoveMethodSpy = Contact["findOneAndRemove"] = jest.fn(() => {
      throw new Error();
    });
    findOneAndReplaceMethodSpy = Contact["findOneAndReplace"] = jest.fn(() => {
      throw new Error();
    });
    updateStatusContactReplaceMethodSpy = Contact["findOneAndUpdate"] = jest.fn(
      () => {
        throw new Error();
      }
    );
  });

  test("should getContacts catch Error", async () => {
    try {
      await getContacts();
      await expect(findMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should getContactById catch Error", async () => {
    try {
      await getContactById();
      await expect(findOneMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should addContact catch Error", async () => {
    try {
      await addContact();
      await expect(createMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should deleteContact catch Error", async () => {
    try {
      await deleteContact();
      await expect(findOneAndRemoveMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should replaceContact catch Error", async () => {
    try {
      await replaceContact();
      await expect(findOneAndReplaceMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });

  test("should updateStatusContact catch Error", async () => {
    try {
      await updateStatusContact();
      await expect(updateStatusContactReplaceMethodSpy).toBeCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(error);
    }
  });
});
