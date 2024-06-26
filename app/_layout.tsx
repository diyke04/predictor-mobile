import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  SplashScreen

  const [fontsLoaded,error]=useFonts({
    "Poppins-Black":require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold":require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium":require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular":require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Thin":require("../assets/fonts/Poppins-Black.ttf"),
  })

  useEffect(()=>{
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()
  },[fontsLoaded,error])

  if(!fontsLoaded &&  !error) return null

  return (
    <Stack screenOptions={{headerShown:false}} >
    
        <Stack.Screen name="index"  />
        <Stack.Screen name="(auth)"  />
        <Stack.Screen name="(tabs)"  />
    </Stack>
  );
}
