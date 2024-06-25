import { View, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import Images from '../../constants/Images';

const SignUp = () => {
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
      <View className='flex-1 w-full justify-center items-center'>
        <Image source={Images.logo1} resizeMode='contain' className='w-[80%]' />
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
          title='Sign Up'
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
