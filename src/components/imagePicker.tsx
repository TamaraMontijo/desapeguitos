import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebaseConfig'

export default function ImagePickerComponent({ onImageUpload }: any) {
  const [image, setImage] = useState<string | null>(null)
  const [progress, setProgress] = useState("0");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      // await uploadImage(result.assets[0].uri, "image");
      const imageUrl = await uploadImage(result.assets[0].uri);
      onImageUpload(imageUrl); 
    }
  }

  async function uploadImage(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Desapego/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress.toFixed());
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  return (
    <View className='flex-1 items-center justify-center border-dashed border-2 border-purple-500 rounded-lg h-80 w-80'>
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title='Trocar imagem' onPress={pickImage} />
        </>
      ) : (
        <Button title='Selecione uma imagem' onPress={pickImage} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
})
