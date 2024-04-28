import { Person, Address, Login } from "./PersonTypes";

export type UserRegistrationForm = {
  person: Person;
  address: Address;
  login: Login;
};

export type UserRegistrationDocument = {
  person: Person;
  address: Address;
  login: Omit<Login, "password">;
}