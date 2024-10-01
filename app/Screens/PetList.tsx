import PetListComponent from "@/components/organisms/PetListComponent"
import { where } from "firebase/firestore"
import React from "react"

export default function PetList() {
  return <PetListComponent query={[where("adoption", "==", true)]} />
}
