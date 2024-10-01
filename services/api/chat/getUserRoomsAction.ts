import { collectionPaths } from "@/constants"
import { Pet, Room, roomSchema, Snapshot, User } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore"
import getUserAction from "../user/getUserAction"
import getPetAction from "../pet/getPetAction"

export type RoomUserAndPetDocument = {
  petDocument: Snapshot<Pet>
  listOfRooms: { room: Snapshot<Room>; user: Snapshot<User> }[]
}

/**
 * Retorna uma lista de salas de chat do usuário
 *
 * @param firebaseApp instância do firebase
 * @returns Lista de salas
 */
export default async function getUserRoomPetAction(
  firebaseApp: FirebaseApp,
): Promise<RoomUserAndPetDocument[]> {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const loggedInUserID = getCurrentUserUID(firebaseApp)

  const roomQuery = query(
    roomCollectionReference,
    where("users", "array-contains", loggedInUserID),
  )
  const roomQuerySnapshot = await getDocs(roomQuery)

  const roomList: {
    pet: Snapshot<Pet>
    room: Snapshot<Room>
    user: Snapshot<User>
  }[] = []
  for (const room of roomQuerySnapshot.docs) {
    const roomDocument: Room = roomSchema.parse(room.data())
    // Filtrar o próprio usuário e pegar o primeiro usuário remanescente.
    const userID = roomDocument.users
      .filter((val) => {
        return val !== loggedInUserID
      })
      .at(0)

    // Caso a sala seja do usuário com ele mesmo, userID vai ser undefined.
    if (!userID) {
      console.error(
        "Error in getUserRoomsAction, no users after filtering logged in user.",
      )
      continue
    }
    const userDocument = await getUserAction(userID, firebaseApp)
    if (!userDocument) {
      console.error(
        "Error in getUserRoomsAction, there is no user with id" + userID,
      )
      continue
    }

    const petID = roomDocument.petID
    const petDocument = await getPetAction(petID, firebaseApp)
    if (!petDocument) {
      console.error(
        "Error in getUserRoomsAction, there is no pet with id" + petID,
      )
      continue
    }

    roomList.push({
      room: { id: room.id, data: roomDocument },
      user: { id: userID, data: userDocument },
      pet: { id: petID, data: petDocument },
    })
  }

  /* A lista roomList até aqui está no formato
   *
   * {
   *   pet: Snapshot<Pet>
   *   room: Snapshot<Room>
   *   user: Snapshot<User>
   * }[]
   *
   * A propiedade pet pode se repetir várias vezes nessa lista, mas com combina-
   * ções de room e user diferentes, o que é um problema, já que queremos listar
   * os chats de conversa por pet.
   *
   * O tipo final é o seguinte
   *
   * {
   *   petDocument: Snapshot<Pet>
   *   listOfRooms: { room: Snapshot<Room>; user: Snapshot<User> }[]
   * }[]
   *
   */

  // Primeiro precisamos pegar apenas ids únicos de pet
  const nubPetId: string[] = []
  // Esse loop é O(n^2)...
  for (const room of roomList) {
    // Se não tem o pet id na lista, adicionar; se já tiver, ignorar.
    if (!nubPetId.includes(room.pet.id)) {
      nubPetId.push(room.pet.id)
    }
  }

  const returnList: RoomUserAndPetDocument[] = []
  // pegar a lista de salas de cada pet e adicionar a returnList
  for (const index_petID of nubPetId) {
    // Encontrar apenas as salas que tenham o pet da vez
    const roomsWithPet = roomList.filter((value) => {
      return value.pet.id === index_petID
    })

    // Pegar o pet do momento, já que o loop só tem o id do Pet
    const petDocument = roomsWithPet[0].pet

    // Criar lista do casal "usuário e sala"
    const userAndRoom = roomsWithPet.map((value) => {
      return { room: value.room, user: value.user }
    })

    // adicionar a lista de retorno.
    returnList.push({ petDocument: petDocument, listOfRooms: userAndRoom })
  }

  return returnList
}
