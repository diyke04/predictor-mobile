import { View, Image, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../../constants/Images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router, useNavigation } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = async () => {
    console.log(username, password);
    setLoading(true);

    try {
      const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
      //const serverUrl = 'https://predictor-backend-omega.vercel.app';
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        username: username,
        password: password
      }, {
        headers: {
          "Content-Type": 'application/json'
        }
      });

      if (response.status === 200) {
        console.log(response.data.access_token)
        login(response.data.access_token);
        router.push('/fixtures')
      } else {
        Alert.alert('Error', response.data.detail);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.detail || 'An error occurred. Please try again.');
      } else if (error.request) {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 w-full px-4 mt-2 justify-center items-center">
          <Image source={Images.logo1} resizeMode='contain' className="w-[200] h-[100] " />
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
            <Text className="text-gray-100 text-lg">Don't have an account yet?</Text>
            <Link href="/sign-up" className="text-color2 ml-2 text-lg">Sign up</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
