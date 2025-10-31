import { test, expect, vi, setSystemTime } from "bun:test";

test("vi.useFakeTimers and vi.useRealTimers wrap/unwrap calls to timers correctly", () => {
  const mockDate = new Date(2022, 0, 1);
  vi.useFakeTimers();
  setSystemTime(mockDate);
  expect(new Date().valueOf()).toBe(mockDate.valueOf());
  // reset mocked time
  vi.useRealTimers();
  expect(new Date().valueOf()).not.toBe(mockDate.valueOf());
});
