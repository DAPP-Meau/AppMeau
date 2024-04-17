export type healthOptions = "vaccinated" | "dewormed" | "neutered" | "sick";
export type speciesOptions = "cat" | "dog";
export type sexOptions = "male" | "female";
export type sizeOptions = "small" | "medium" | "large";
export type ageOptions = "cub" | "adult" | "old";
export type temperamentOptions =
  | "playful"
  | "shy"
  | "calm"
  | "guard"
  | "loving"
  | "lazy";

export interface Animal {
  name: string;
  species: speciesOptions;
  sex: sexOptions;
  size: sizeOptions;
  age: ageOptions;
  temperament: temperamentOptions;
  health: Set<healthOptions>;
  sicknesses?: string;
}
