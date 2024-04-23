import { colors } from '@/styles/colors'
import { Plus } from 'lucide-react-native'
import { View } from 'react-native'

export default function CreateAddButton() {
  return (
    <View className='bg-purple-500 rounded-full p-4'>
      <Plus color={colors.white} />
    </View>
  )
}
