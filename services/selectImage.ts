import {
  CameraType,
  ImagePickerOptions,
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker"
import { Alert } from "react-native"

const options: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  cameraType: CameraType.front,
  aspect: [4, 4],
  quality: 0,
}

async function getImageURIFromPicker(
  picker: (options: ImagePickerOptions) => Promise<ImagePickerResult>,
) {
  const imageResult = await picker(options)
  if (!imageResult.canceled) {
    return imageResult.assets[0].uri
  }
}

// TODO: modal
export default async function selectImage(setImageUri: (uri: string) => void) {
  Alert.alert("Selecione sua imagem", undefined, [
    {
      text: "Sair",
      style: "cancel",
    },
    {
      text: "Camera",
      onPress: async () => {
        const imageURI = await getImageURIFromPicker(launchCameraAsync)
        setImageUri(imageURI!)
      },
      style: "default",
    },
    {
      text: "Galeria",
      onPress: async () => {
        const imageURI = await getImageURIFromPicker(launchImageLibraryAsync)
        setImageUri(imageURI!)
      },
      style: "default",
    },
  ])
}
