const Contact = require("../../../models/contact");
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  replaceContactController,
} = require("../../../controller/api");

describe("Test api controllers", () => {
  let mReq,
    mRes,
    mNext,
    getAllContactsServiceSpy,
    getOneContactServiceSpy,
    addContactServiceSpy,
    deleteContactServiceSpy,
    replaceContactServiceSpy,
    updateStatusContactServiceSpy;

  beforeEach(() => {
    mReq = {
      headers: {},
      body: {
        email: "replex@gmail.com",
        password: "1333444",
      },
      query: {},
      params: {
        id: "",
      },
      owner: { _id: "" },
    };
    mRes = { status: jest.fn(() => mRes), json: jest.fn((msg) => msg) };
    mNext = jest.fn();

    getAllContactsServiceSpy = jest
      .spyOn(Contact, "find")
      .mockImplementationOnce(() => ({
        skip: () => ({
          limit: () => ({ contacts: [] }),
        }),
      }));

    getOneContactServiceSpy = Contact.findOne = jest.fn(() => ({
      contact: {},
    }));
    addContactServiceSpy = Contact.create = jest.fn(() => ({ contact: {} }));
    deleteContactServiceSpy = Contact.findOneAndRemove = jest.fn(() => ({
      contact: {},
    }));
    replaceContactServiceSpy = Contact.findOneAndReplace = jest.fn(() => ({
      contact: {},
    }));
    updateStatusContactServiceSpy = Contact.findOneAndUpdate = jest.fn(() => ({
      contact: {},
    }));
  });
  describe("Test getContactsController", () => {
    test("should getContactsController return contacts", async () => {
      await getContactsController(mReq, mRes, mNext);

      await expect(getAllContactsServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should getContactsController catch Error without params", async () => {
      try {
        await getContactsController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test getContactByIdController", () => {
    test("should getContactByIdController return contact", async () => {
      await getContactByIdController(mReq, mRes, mNext);

      await expect(getOneContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should getContactByIdController call 401 response if contact not found", async () => {
      const getOneContactServiceSpy = (Contact.findOne = jest.fn(() => null));
      await getContactByIdController(mReq, mRes, mNext);

      await expect(getOneContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should getContactByIdController catch Error without params", async () => {
      try {
        await getContactByIdController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test addContactController", () => {
    test("should addContactController create new contact", async () => {
      await addContactController(mReq, mRes, mNext);

      await expect(addContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(201);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should addContactController catch Error without params", async () => {
      try {
        await addContactController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test deleteContactController", () => {
    test("should deleteContactController delete contact", async () => {
      await deleteContactController(mReq, mRes, mNext);

      await expect(deleteContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should deleteContactController call 404 response if contact not found", async () => {
      const deleteContactServiceSpy = (Contact.findOneAndRemove = jest.fn(
        () => null
      ));
      await deleteContactController(mReq, mRes, mNext);

      await expect(deleteContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should deleteContactController catch Error without params", async () => {
      try {
        await deleteContactController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test replaceContactController", () => {
    test("should replaceContactController replace contact", async () => {
      await replaceContactController(mReq, mRes, mNext);

      await expect(replaceContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });
    test("should replaceContactController call 404 response if contact not found", async () => {
      const replaceContactServiceSpy = (Contact.findOneAndReplace = jest.fn(
        () => null
      ));
      await replaceContactController(mReq, mRes, mNext);

      await expect(replaceContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should replaceContactController catch Error without params", async () => {
      try {
        await replaceContactController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("Test updateContactController", () => {
    test("should updateContactController update contact status", async () => {
      await updateContactController(mReq, mRes, mNext);

      await expect(updateStatusContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalled();
    });
    test("should updateContactController call 404 response if contact not found", async () => {
      const updateStatusContactServiceSpy = (Contact.findOneAndUpdate = jest.fn(
        () => null
      ));
      await updateContactController(mReq, mRes, mNext);

      await expect(updateStatusContactServiceSpy).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.json).toHaveBeenCalled();
    });

    test("should updateContactController catch Error without params", async () => {
      try {
        await updateContactController();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
