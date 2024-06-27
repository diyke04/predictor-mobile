import {Text, Pressable, View, AccessibilityRole } from 'react-native'
import React from 'react'

interface CustomButtonProps {
  title: string;
  accessible?:boolean
  accessibilityRole?:AccessibilityRole
  onPress: () => void;

}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress,accessible,accessibilityRole }) => {
  return (
    <View className='w-full px-6  bg-color1 text-white rounded-md hover:bg-color2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
      <Pressable className='p-4 rounded-sm bg-color1' onPress={onPress} accessible={accessible} accessibilityRole={accessibilityRole}>
      <Text className='text-gray-100 text-center text-base'>{title}</Text>
    </Pressable>
    </View>
  );
}

export default CustomButton;