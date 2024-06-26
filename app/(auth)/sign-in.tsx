import { View, Image, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../../constants/Images'
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };
  const handleSubmit =async ()=>{
    console.log(username, password)

  }

  return (
    <SafeAreaView>
      <View className='bg-background justify-center items-center w-[100%] h-full p-4'>
        <Image source={Images.logo1} resizeMode='contain' className='w-[85%]' />
        <FormField 
          placeholder='username' 
          inputTitle='Username' 
          value={username} 
          setValue={handleUsernameChange}
          secureTextEntry={false} 
        />
        <FormField
          placeholder='password'
          inputTitle='Password'
          value={password}
          setValue={handlePasswordChange}
          secureTextEntry={true}
        />
        <CustomButton
          title='Login'
          onPress={handleSubmit}
        />

      <View className='flex-row items-center'>
        <Text className='text-gray-100 text-lg'> Dont have an account yet?</Text>
        <Link href="/sign-up" className='text-secondary-100 '>Sign up</Link>

      </View>

      </View>
    </SafeAreaView>
  );
};

export default SignIn;
