import { View, Text, TextInput } from 'react-native';
import React from 'react';

interface FormFieldProps {
  inputTitle: string;
  value: string;
  setValue: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder: string;
}

const FormField: React.FC<FormFieldProps> = ({ placeholder, inputTitle, value, setValue, secureTextEntry }) => {
  return (
    <View className='p-2 w-full '>
      <Text className='text-gray-100 font-base text-left p-2'>{inputTitle}</Text>
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
        className='bg-white text-gray-800 border-gray-700 p-4'
      />
    </View>
  );
};

export default FormField;
