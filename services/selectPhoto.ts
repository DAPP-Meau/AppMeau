import {
  CameraType,
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker"
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { Alert } from "react-native"

const options: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  cameraType: CameraType.front,
  aspect: [4, 4],
  quality: 1,
}

const pickImageGallery = async () => {
  return await launchImageLibraryAsync(options)
}

const pickImageCam = async () => {
  return await launchCameraAsync(options)
}

function tratarImagem(
  result: ImagePickerResult,
  setImage: (x: string) => void,
) {
  if (!result.canceled) {
    setImage(result.assets[0].uri)
  }
}

// TODO: modal
export async function handleImage(setImage: (x: string) => void) {
  Alert.alert("", "", [
    {
      text: "Camera",
      onPress: async () => {
        tratarImagem(await pickImageCam(), setImage)
      },
      style: "default",
    },
    {
      text: "Galeria",
      onPress: async () => {
        tratarImagem(await pickImageGallery(), setImage)
      },
      style: "default",
    },
    {
      text: "Sair",
      style: "default",
    },
  ])
}

export async function submitData (
  image: string,
  storage: FirebaseStorage,
  nameImage: string,
) {
  const storageRef = ref(storage, nameImage)
  const image_pet = await fetch(image)
  const image_blob = await image_pet.blob()
  const snapshot = await uploadBytesResumable(storageRef, image_blob)
  const url_image = await getDownloadURL(snapshot.ref)
  return url_image
}
