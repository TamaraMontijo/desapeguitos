import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from '../../firebaseConfig'

export default function ImagePickerComponent() {
  const [image, setImage] = useState<string | null>(null)
  const [progress, setProgress] = useState("0");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      await uploadImage(result.assets[0].uri, "image");
    }
  }

  async function uploadImage(uri: any, fileType: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Desapego/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());
      },
      (error) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
        });
      }
    );
  }

  async function saveRecord(fileType: string, url: string, createdAt: string) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
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
