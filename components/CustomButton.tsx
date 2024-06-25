import {Text, Pressable } from 'react-native'
import React from 'react'

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable className='p-4 rounded-sm w-full bg-green-500' onPress={onPress}>
      <Text className='text-gray-100 p-2 text-center text-base'>{title}</Text>
    </Pressable>
  );
}

export default CustomButton;