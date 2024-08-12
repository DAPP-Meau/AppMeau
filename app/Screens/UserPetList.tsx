import PetListComponent from "@/components/molecules/PetListComponent"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseAppContext } from "@/utils/store/firebaseAppContext"
import { where } from "firebase/firestore"
import React, { useContext } from "react"

export default function PetList() {
  const firebaseApp = useContext(FirebaseAppContext)
  const uid = getCurrentUserUID(firebaseApp)

  return <PetListComponent query={[where("owner_uid", "==", uid)]} />
}
