import { describe, expect, test } from "@jest/globals"
import { listRemove, listUnion } from "../listUtils"

describe("List union unit tests", () => {
  test("listUnion with an undefined makes a new list in place", () => {
    let l : Array<string> | undefined = undefined
    l = listUnion(l, "a")
    expect(l).toStrictEqual(["a"])
  }),
  test("listUnion with a empty list pushes to the list in place", () => {
    let l : Array<string> = []
    l = listUnion(l, "a")
    expect(l).toStrictEqual(["a"])
  }),
  test("listUnion with a list makes a new list", () => {
    let l : Array<string> = ["a", "b"]
    l = listUnion(l, "c")
    expect(l).toStrictEqual(["a", "b", "c"])
  })
})

describe("List remove unit tests", () => {
  test("listRemove with an undefined returns empty list", () => {
    let l : Array<string> | undefined = undefined
    l = listRemove(l, "a")
    expect(l).toStrictEqual([])
  }),
  test("listRemove with a empty list returns empty list", () => {
    let l : Array<string> = []
    l = listRemove(l, "a")
    expect(l).toStrictEqual([])
  }),
  test("listRemove with a list that contains the value removes that value", () => {
    let l : Array<string> = ["a", "b", "c"]
    l = listRemove(l, "b")
    expect(l).toStrictEqual(["a", "c"])
  })
  test("listRemove with a list that contains multiple elements of that value removes all values", () => {
    let l : Array<string> = ["a", "b", "b", "c"]
    l = listRemove(l, "b")
    expect(l).toStrictEqual(["a", "c"])
  })
})
