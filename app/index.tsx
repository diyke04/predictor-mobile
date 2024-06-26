import { Link} from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../constants/Images'


export default function Index() {
  return (
    <SafeAreaView className="" >
      <ScrollView contentContainerStyle={{height:'100%'}} className="bg-background">
        <View className="w-full justify-center items-center h-full px-4">
          <Image source={images.logo1} resizeMode="contain" className="w-[85%] h-[30%] "/>
          
      
          <Link href={'/sign-in'} className="text-color2 text-3xl font-pbold ">Get started </Link>
          
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}
