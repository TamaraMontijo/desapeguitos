import { Button } from "@/components/button";
import ImagePickerComponent from "@/components/imagePicker";
import { Input } from "@/components/input";
import { colors } from "@/styles/colors";
import { ChevronDown, Menu } from "lucide-react-native";
import { useState } from "react";
import { Alert, View } from "react-native";
import { ScrollView, Text } from "react-native";
import * as DropdownMenu from 'zeego/dropdown-menu'
import { MaskedText, MaskedTextInput } from "react-native-mask-text";
import { router } from "expo-router";


export default function Create() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cep, setCep] = useState("")
  const [type, setType] = useState("")


  const [maskedValue, setMaskedValue] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  function handleCreateDesapego() {
    if (!title.trim() || !description.trim() || !cep.trim()) {
      Alert.alert('Preencha todos os campos')
    } else {
      console.log(title, description, cep, type)
      console.log("publicado")
      router.navigate('/')
    }
  }

  return (
    <ScrollView className="p-4">
      <View className="items-center p-8 h-96">
        <ImagePickerComponent></ImagePickerComponent>
      </View>
      <View className="pb-8">
        <Input>
          <Input.Field placeholder="Título" returnKeyType="default" onChangeText={setTitle} />
        </Input>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Input style="">
              <Input.Field placeholder={type ? type : 'Tipo'} readOnly />
              <ChevronDown color={colors.primary[500]} />
            </Input>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item key="donation" onSelect={() => setType('Doação')}>
              <DropdownMenu.ItemTitle> Doação </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="sell" onSelect={() => setType('Venda')}>
              <DropdownMenu.ItemTitle> Venda </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="exchange" onSelect={() => setType('Troca')}>
              <DropdownMenu.ItemTitle> Troca </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <Input style="h-32">
          <Input.Field placeholder="Descrição" returnKeyType="default" onChangeText={setDescription} multiline />
        </Input>

        <Input>
        <MaskedTextInput
            placeholder="CEP"
            mask="99999-999"
            onChangeText={(text, rawText) => {
              setMaskedValue(text);
              setCep(rawText);
            }}
            keyboardType="numeric"
          />
        </Input>

        <Input>
          <MaskedTextInput
            placeholder="Número do Whatsapp"
            mask="(99) 99999-9999"
            onChangeText={(text, rawText) => {
              setMaskedValue(text);
              setWhatsappNumber(rawText);
            }}
            keyboardType="numeric"
          />
        </Input>


      </View>
      <View className="mb-16">
        <Button title="Publicar" bgColor={'bg-yellow'} onPress={handleCreateDesapego}></Button>
      </View>
    </ScrollView>
  )
}