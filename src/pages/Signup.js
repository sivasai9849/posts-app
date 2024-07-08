import React, { useState } from "react";
import { View, TextInput,StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import AnimatedLoader from "react-native-animated-loader";



const Signup = () => {
  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to control the loading animation
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleSignup = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          // User creation successful
          setTimeout(() => {
          setIsLoading(false);
          setSuccess(true);
        }, 1000);
        })
        .catch((error) => {
          // Handle specific error cases
          
          if (error.code === 'auth/email-already-in-use') {
            setErrorMessage('Email is already in use.');
          } else if (error.code === 'auth/invalid-email') {
            setErrorMessage('Invalid email address.');
          } else if (error.code === 'auth/weak-password') {
            setErrorMessage('Weak password. It should be at least 6 characters long.');
          } else {
            setErrorMessage('Signup error occurred.');
          }
          setTimeout(() => {
            setIsLoading(false);
          setIsModalVisible(true); 
        }, 1000);
        });
    } catch (error) {
      console.log('Signup error:', error);
    }
    
  };

  return (
    <View className="flex-1 items-center justify-center bg-white -mt-12">
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="flex-1 items-center justify-center bg-white -mt-12">
            <Text className="text-2xl font-bold mb-6">Sign Up</Text>
            <TextInput
              className={`w-64 h-10 px-2 mb-4 border ${
                errors.email && touched.email
                  ? "border-red-500"
                  : touched.email
                  ? "border-green-500"
                  : "border-gray-400"
              } rounded`}
              placeholder={
                errors.email && touched.email ? errors.email : "Email"
              }
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            <View className="relative">
              <TextInput
                className={`w-64 h-10 px-2 mb-4 border ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : touched.password
                    ? "border-green-500"
                    : "border-gray-400"
                } rounded`}
                placeholder={
                  errors.password && touched.password
                    ? errors.password
                    : "Password"
                }
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
            <View className="relative">
              <TextInput
                className={`w-64 h-10 px-2 mb-4 border ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : touched.confirmPassword
                    ? "border-green-500"
                    : "border-gray-400"
                } rounded`}
                placeholder={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : "Confirm Password"
                }
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute top-3 right-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="w-64 h-10 bg-blue-500 rounded justify-center items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Modal isVisible={success} className="items-center -mb-96">
        <View className="w-64 items-center p-4 bg-green-200 rounded">
          <Text className="text-green-800">Signup successful!</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4"
          >
            <View className="bg-transparent border border-green-500 py-2 px-4 rounded">
              <Text className="text-green-500 font-semibold">Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isModalVisible} onRequestClose={()=>setIsModalVisible(false)} className="items-center -mb-96">
        <View className="w-64 items-center p-4 bg-red-200 rounded">
          <Text className="text-red-800">{errorMessage}</Text>
          <TouchableOpacity
            onPress={() => {setIsModalVisible(false); setErrorMessage('');}}
            className="mt-4"
          >
            <View className="bg-transparent border border-red-500 py-2 px-4 rounded">
              <Text className="text-red-500 font-semibold">Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      {isLoading && <AnimatedLoader 
        visible={isLoading}
        overlayColor="rgba(255,255,255,0.9)"
        source={require("../../assets/loader1.json")}  
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text className="  text-lg  text-cyan-500 font-bold mb-6">Bees communicate through dancing.</Text>
      </AnimatedLoader>
      
      }

    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});