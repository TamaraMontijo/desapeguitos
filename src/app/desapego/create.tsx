import { Button } from "@/components/button";
import ImagePickerComponent from "@/components/imagePicker";
import { Input } from "@/components/input";
import { useState } from "react";
import { Alert, View } from "react-native";
import { ScrollView, Text } from "react-native";


export default function Create(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cep, setCep] = useState("")

  function handleCreateDesapego() {
    if(!title.trim() || !description.trim() || !cep.trim()) {
      Alert.alert('Preencha todos os campos')
    } else {
      console.log("publicado")
    }
  }

  return (
    <ScrollView className="p-4">
      <View className="items-center p-8 h-96">
        <ImagePickerComponent></ImagePickerComponent>
      </View>
      <View className="pb-8">
      <Input style="">
        <Input.Field placeholder="Título" returnKeyType="default" onChangeText={setTitle}/>
      </Input>
      <Input style="h-32">
        <Input.Field placeholder="Descrição" returnKeyType="default" onChangeText={setDescription} />
      </Input>
      <Input style="">
        <Input.Field placeholder="CEP" keyboardType="number-pad" onChangeText={setCep}/>
      </Input>

      </View>
      <View className="mb-16">
        <Button title="Publicar" bgColor={'bg-yellow'} onPress={handleCreateDesapego}></Button>
      </View>
    </ScrollView>
  )
}