
import { View, Image, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../../constants/Images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useNavigation } from 'expo-router';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); 

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleSubmit = async () => {
    console.log(username, password);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/register", {
        "username": username,
        "password": password
      });

      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: '/login' },
            ],
          })
        );
      } else {
        Alert.alert('Error', response.data['detail']);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-center items-center p-4 bg-gray-100">
          <Image source={Images.logo1} resizeMode='contain' className="w-[85%] mb-8" />
          <FormField
            placeholder='Username'
            inputTitle='Username'
            value={username}
            setValue={handleUsernameChange}
            secureTextEntry={false}
            accessible={true}
            accessibilityLabel="Username"
          />
          <FormField
            placeholder='Password'
            inputTitle='Password'
            value={password}
            setValue={handlePasswordChange}
            secureTextEntry={true}
            accessible={true}
            accessibilityLabel="Password"
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
          ) : (
            <CustomButton
              title='Login'
              onPress={handleSubmit}
              accessible={true}
              accessibilityRole="button"
              
            />
          )}

          <View className="flex-row items-center mt-4">
            <Text className="text-gray-600 text-lg">Already have an account?</Text>
            <Link href="/sign-in" className="text-blue-500 ml-2">Sign in</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
