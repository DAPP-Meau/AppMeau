import PetListComponent from "@/components/organisms/PetListComponent"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"
import { where } from "firebase/firestore"
import React, { useContext } from "react"

export default function PetList() {
  return (
    <PetListComponent query={[where("adoption", "==", true)]} />
  )
}
