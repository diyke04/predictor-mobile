
import { View, Image, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../../constants/Images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useNavigation } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CommonActions } from '@react-navigation/native';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // use the login function from context
  const navigation = useNavigation(); // get the navigation object

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
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
        "username": username,
        "password": password
      });

      if (response.status === 200) {
        // Call the login function to save the token in context
        login(response.data.token);
        // Navigate to /fixture after successful login
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: '/fixture' },
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
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 w-full min-h-[85vh] px-4 my-6 justify-center items-center ">
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
            <Text className="text-gray-600 text-lg">Don't have an account yet?</Text>
            <Link href="/sign-up" className="text-blue-500 ml-2">Sign up</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
