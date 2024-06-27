import { Link, Redirect } from "expo-router";
import { Image, ScrollView,View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../constants/Images';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { token } = useAuth();

  if (token) {
    return <Redirect href="/fixtures" />;
  }

  return (
    <SafeAreaView className="" >
      <ScrollView contentContainerStyle={{ height: '100%' }} className="bg-background">
        <View className="w-full justify-center items-center h-full px-4">
          <Image source={images.logo1} resizeMode="contain" className="w-[85%] h-[30%]" />
          <Link href="/sign-in" className="text-color2 text-3xl font-pbold">Get started</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
