import {Text, Pressable, View } from 'react-native'
import React from 'react'

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <View className='p-2 w-full'>
      <Pressable className='p-4 rounded-sm bg-color1' onPress={onPress}>
      <Text className='text-gray-100 text-center text-base'>{title}</Text>
    </Pressable>
    </View>
  );
}

export default CustomButton;