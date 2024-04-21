export type speciesOptions = "cat" | "dog";
export type sexOptions = "male" | "female";
export type sizeOptions = "small" | "medium" | "large";
export type ageOptions = "cub" | "adult" | "old";

export interface Animal {
  name: string;
  species: speciesOptions;
  sex: sexOptions;
  size: sizeOptions;
  age: ageOptions;
  temperament: {
    playful: boolean;
    shy: boolean;
    calm: boolean;
    guard: boolean;
    loving: boolean;
    lazy: boolean;
  };
  health: {
    vaccinated: boolean;
    dewormed: boolean;
    neutered: boolean;
    sick: boolean;
  };
  sicknesses?: string;
  story?: string;
}
