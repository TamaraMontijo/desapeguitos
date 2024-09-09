import { Button } from "@/components/button";
import ImagePickerComponent from "@/components/imagePicker";
import { Input } from "@/components/input";
import { colors } from "@/styles/colors";
import { ChevronDown, Menu } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { ScrollView, Text } from "react-native";
import * as DropdownMenu from 'zeego/dropdown-menu'
import { MaskedTextInput } from "react-native-mask-text";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";



export default function Create() {

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [cep, setCep] = useState("")
  const [type, setType] = useState("")
  const [price, setPrice] = useState("")
  const [size, setSize] = useState("")
  const [itensToExchange, setItensToExchange] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [maskedValue, setMaskedValue] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);


    // Função para resetar os campos do "formulário"
    const resetForm = () => {
      setTitle("");
      setDescription("");
      setCep("");
      setType("");
      setPrice("");
      setItensToExchange("");
      setWhatsappNumber("");
      setCategory("");
      setSize("");
      setImageUrl(null);

      // Incrementa a chave para forçar re-render
      setResetKey(prevKey => prevKey + 1);
    };

  async function handleCreateDesapego() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não está autenticado.");
    }

    if (!title.trim() || !description.trim() || !cep.trim() || !whatsappNumber.trim() || !type.trim()) {
      Alert.alert('Preencha todos os campos');
    } else {
      try {
        setIsCreating(true);
        await addDoc(collection(db, 'desapego'), {
          title,
          description,
          cep,
          type,
          whatsappNumber,
          price,
          itensToExchange,
          imageUrl,
          category,
          size,
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL,
          createdAt: new Date(),
        });
        Alert.alert('Desapego criado com sucesso!');
        resetForm();
        router.navigate('/')
      } catch (error: any) {
        Alert.alert('Erro ao criar o desapego: ', error.message);
      } finally {
        setIsCreating(false);
      }
    }
  }

  return (
    <ScrollView className="p-4">
      <View className="items-center p-8 h-96">
        <ImagePickerComponent onImageUpload={setImageUrl} key={`${resetKey}-image`}></ImagePickerComponent>
      </View>
      <View className="pb-8">
        <Input>
          <Input.Field placeholder="Título" returnKeyType="default" onChangeText={setTitle} key={`${resetKey}-title`} />
        </Input>

        <Input style="h-32">
          <Input.Field placeholder="Descrição" returnKeyType="default" onChangeText={setDescription} multiline key={`${resetKey}-description`}  />
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

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Input style="">
              <Input.Field placeholder={category ? category : 'Categoria'} readOnly />
              <ChevronDown color={colors.primary[500]} />
            </Input>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item key="fraldas" onSelect={() => setCategory('Fraldas')}>
              <DropdownMenu.ItemTitle> Fraldas </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="roupas" onSelect={() => setCategory('Roupas')}>
              <DropdownMenu.ItemTitle> Roupas </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="moveis" onSelect={() => setCategory('Móveis')}>
              <DropdownMenu.ItemTitle> Móveis </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="brinquedos" onSelect={() => setCategory('Brinquedos')}>
              <DropdownMenu.ItemTitle> Brinquedos </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="material" onSelect={() => setCategory('Material')}>
              <DropdownMenu.ItemTitle> Material Escolar </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {
          ( category === 'Fraldas') && 
          (
            <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Input style="">
              <Input.Field placeholder={size ? size : 'Tamanho'} readOnly />
              <ChevronDown color={colors.primary[500]} />
            </Input>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item key="rn" onSelect={() => setSize('RN')}>
              <DropdownMenu.ItemTitle> RN </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="p" onSelect={() => setSize('P')}>
              <DropdownMenu.ItemTitle> P </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="m" onSelect={() => setSize('M')}>
              <DropdownMenu.ItemTitle> M </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="g" onSelect={() => setSize('G')}>
              <DropdownMenu.ItemTitle> G </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="xg" onSelect={() => setSize('XG')}>
              <DropdownMenu.ItemTitle> XG </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item key="xxg" onSelect={() => setSize('XXG')}>
              <DropdownMenu.ItemTitle> XXG </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
          )
        }
        
        {
          (type === 'Venda' || type === 'Troca') &&
          <Input>
              {
                (type === 'Venda') ?
                  <Input.Field placeholder="Preço" returnKeyType="default" onChangeText={setPrice} multiline /> 
                :
                <Input.Field placeholder="Itens para troca" returnKeyType="default" onChangeText={setItensToExchange} multiline /> 
              }
          </Input>
        }
        
        <Input key={`${resetKey}-cep`} >
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
        

        <Input key={`${resetKey}-zap`} >
          <MaskedTextInput
            placeholder="Número do Whatsapp"
            mask="(99) 99999-9999"
            onChangeText={(text, rawText) => {
              setMaskedValue(text);
              setWhatsappNumber(`55${rawText}`);
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