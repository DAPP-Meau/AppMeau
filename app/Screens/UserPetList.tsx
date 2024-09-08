import PetListComponent from "@/components/organisms/PetListComponent"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { where } from "firebase/firestore"
import React, { useContext } from "react"
import { PetAndOwnerDocument } from "@/models"
import PetCardWithInterestedUsers from "@/components/molecules/PetCardWithInterestedUsers"

export default function PetList() {
  const firebaseApp = useContext(FirebaseAppContext)
  const uid = getCurrentUserUID(firebaseApp)

  const card = (item: PetAndOwnerDocument): React.JSX.Element => {
    return <PetCardWithInterestedUsers pet={item.pet} />
  }

  return (
    <PetListComponent query={[where("owner_uid", "==", uid)]} card={card} />
  )
}
