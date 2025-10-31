import { vi, describe, test, expect } from "vitest";

describe("vi API", () => {
  test("vi.fn creates mock functions", () => {
    const mockFn = vi.fn((x: number) => x * 2);
    expect(mockFn(5)).toBe(10);
    expect(mockFn.mock.calls.length).toBe(1);
  });

  test("vi.spyOn spies on methods", () => {
    const obj = { add: (a: number, b: number) => a + b };
    const addSpy = vi.spyOn(obj, "add");
    obj.add(2, 3);
    expect(addSpy).toHaveBeenCalledWith(2, 3);
  });

  test("vi.mock mocks modules", async () => {
    vi.mock("fs/promises", () => ({ readFile: () => "mocked" }));
    const { readFile } = await import("fs/promises");
    expect(readFile("test.txt")).toBe("mocked");
  });

  test("vi.clearAllMocks clears mocks history but DOES NOT affect mock implementations", () => {
    const person = {
      sayHi: (name: string) => `Hi ${name}`,
      sayBye: (name: string) => `Bye ${name}`,
    };

    const sayHiSpy = vi
      .spyOn(person, "sayHi")
      .mockImplementation(() => "mocked hi");
    const sayByeSpy = vi
      .spyOn(person, "sayBye")
      .mockImplementation(() => "mocked bye");

    expect(person.sayHi("Alice")).toBe("mocked hi");
    expect(sayHiSpy.mock.calls).toEqual([["Alice"]]);

    expect(person.sayBye("Alice")).toBe("mocked bye");
    expect(sayByeSpy.mock.calls).toEqual([["Alice"]]);

    // clears mock call history but keeps mock implementation
    vi.clearAllMocks();

    expect(sayHiSpy.mock.calls).toEqual([]);
    expect(person.sayHi).toBe(sayHiSpy);
    expect(person.sayHi("Bob")).toBe("mocked hi");
    expect(sayHiSpy.mock.calls).toEqual([["Bob"]]);

    expect(sayByeSpy.mock.calls).toEqual([]);
    expect(person.sayBye).toBe(sayByeSpy);
    expect(person.sayBye("Bob")).toBe("mocked bye");
    expect(sayByeSpy.mock.calls).toEqual([["Bob"]]);
  });

  test("vi.resetAllMocks clears mock history AND resets each mock's implementation", async () => {
    const person = {
      sayHi: (name: string) => `Hi ${name}`,
      sayBye: (name: string) => `Bye ${name}`,
    };

    const sayHiSpy = vi
      .spyOn(person, "sayHi")
      .mockImplementation(() => "mocked hi");
    const sayByeSpy = vi
      .spyOn(person, "sayBye")
      .mockImplementation(() => "mocked bye");

    expect(person.sayHi("Alice")).toBe("mocked hi");
    expect(sayHiSpy.mock.calls).toEqual([["Alice"]]);
    expect(person.sayBye("Alice")).toBe("mocked bye");
    expect(sayByeSpy.mock.calls).toEqual([["Alice"]]);

    // clears mock call history and resets each mock's implementation
    vi.resetAllMocks();

    expect(sayHiSpy.mock.calls).toEqual([]);
    expect(person.sayHi).toBe(sayHiSpy);
    expect(person.sayHi("Bob")).toBe("Hi Bob");
    expect(sayHiSpy.mock.calls).toEqual([["Bob"]]);

    expect(sayByeSpy.mock.calls).toEqual([]);
    expect(person.sayBye).toBe(sayByeSpy);
    expect(person.sayBye("Bob")).toBe("Bye Bob");
    expect(sayByeSpy.mock.calls).toEqual([["Bob"]]);
  });

  test("vi.restoreAllMocks restores all implementations on spies but DOES NOT clear mock history or reset the mock implementations", () => {
    const person = {
      sayHi: (name: string) => `Hi ${name}`,
      sayBye: (name: string) => `Bye ${name}`,
    };

    const sayHiSpy = vi
      .spyOn(person, "sayHi")
      .mockImplementation(() => "mocked hi");
    const sayByeSpy = vi
      .spyOn(person, "sayBye")
      .mockImplementation(() => "mocked bye");

    expect(person.sayHi("Alice")).toBe("mocked hi");
    expect(sayHiSpy.mock.calls).toEqual([["Alice"]]);
    expect(person.sayBye("Alice")).toBe("mocked bye");
    expect(sayByeSpy.mock.calls).toEqual([["Alice"]]);

    // restores implementations but DOES NOT clear mock history or reset the mock implementations
    vi.restoreAllMocks();

    expect(person.sayHi).not.toBe(sayHiSpy);
    expect(person.sayHi("Bob")).toEqual("Hi Bob");

    expect(person.sayBye).not.toBe(sayByeSpy);
    expect(person.sayBye("Bob")).toEqual("Bye Bob");

    // verify that mock call history is not cleared
    expect(sayHiSpy.mock.calls).toEqual([["Alice"]]);
    expect(sayByeSpy.mock.calls).toEqual([["Alice"]]);

    // verify that mock implementations remain set (though now detached)
    expect(sayHiSpy.getMockImplementation?.()?.("Test")).toBe("mocked hi");
    expect(sayByeSpy.getMockImplementation?.()?.("Test")).toBe("mocked bye");
  });
});
