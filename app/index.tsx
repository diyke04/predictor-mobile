import { Link} from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../constants/Images'


export default function Index() {
  return (
    <SafeAreaView className="bg-gray-900 flex-1 justify-center items-center" >
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[35px]"/>
          
          <Text className="text-6xl text-center  font-pbold text-gray-100 " >Point Predict</Text>
          <Link href={'/sign-in'}>Get started </Link>
          
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}
