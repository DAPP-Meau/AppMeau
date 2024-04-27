import { Person, Address, Login } from "./PersonTypes";

export type UserRegistrationForm = {
  person: Person;
  address: Address;
  login: Login;
};
