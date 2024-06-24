import { Redirect } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  return (
    <SafeAreaView className="bg-gray-800 flex-1 justify-center items-center" >
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Text className="text-center font-black">Point Predict</Text>
          
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}
