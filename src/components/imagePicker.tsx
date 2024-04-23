import { useState } from 'react'
import { Button, Image, View, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export default function ImagePickerComponent() {
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    // console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
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
