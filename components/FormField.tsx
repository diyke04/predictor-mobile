import { View, Text, TextInput } from 'react-native';
import React from 'react';

interface FormFieldProps {
  inputTitle: string;
  value: string;
  setValue: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder: string;
  accessible?:boolean
  accessibilityLabel?:string
}

const FormField: React.FC<FormFieldProps> = ({ placeholder, inputTitle, value, setValue, secureTextEntry,accessible,accessibilityLabel }) => {
  return (
    <View className='p-2 w-full '>
      <Text className='text-gray-100 font-base text-left p-2'>{inputTitle}</Text>
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        className='bg-white text-gray-800 border-gray-700 p-4'
      />
    </View>
  );
};

export default FormField;
