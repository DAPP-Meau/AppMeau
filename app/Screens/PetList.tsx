import PetListComponent from "@/components/organisms/PetListComponent"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"
import { where } from "firebase/firestore"
import React, { useContext } from "react"

export default function PetList() {
  const user = useContext(LoggedInUserContext)
  if (!user?.id) {
    console.error("userID vazio para rodar lista de pets!");
  }
  return (
    <PetListComponent
      query={[where(user?.id ?? "", "not-in", "rejectedUsersList")]}
    />
  )
}
