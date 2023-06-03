import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import Modal from "react-native-modal";
import { signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedLoader from "react-native-animated-loader";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (values) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        const user = auth.currentUser;
        // Login successful
       setTimeout(() => {
        setIsLoading(false);
        navigation.navigate("Home");
        }, 1000);
      })
      .catch((error) => {
        
        if (error.code === "auth/user-not-found") {
          setErrorMessage(
            "User not found. Please check your email and password."
          );
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage(
            "Wrong password. Please check your email and password."
          );
        } else {
          setErrorMessage("Login error occurred.");
        }
        setTimeout(() => {
          setIsLoading(false);
        setIsErrorModalVisible(true);
        }, 1000);
      });
  };

  const handleForgotPassword = () => {
    // Add your logic for handling forgot password here
    // For example, navigate to a "Forgot Password" screen
    navigation.navigate("ForgotPassword");
  };

  const goToSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-2xl font-bold mb-6">Login</Text>
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
            placeholderTextColor={
              touched.email && errors.email ? "red" : "#000000"
            }
            onChangeText={handleChange("email")}
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
              placeholderTextColor={
                touched.password && errors.password ? "red" : "#000000"
              }
              onChangeText={handleChange("password")}
              value={values.password}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-64 h-10 bg-blue-500 rounded justify-center items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-blue-600 mt-4">Forgot Password?</Text>
          </TouchableOpacity>
          
          <View className="mt-4">
            <Text className="text-gray-600">
              Don't have an account?{" "}
              <Text
                className="text-blue-600 active:text-blue-300"
                onPress={goToSignup}
              >
                Signup
              </Text>
            </Text>
          </View>
          
          <Modal
            isVisible={isErrorModalVisible}
            onRequestClose={() => setIsErrorModalVisible(false)}
            className="items-center -mb-96"
          >
            <View className="w-64 items-center p-4 bg-red-200 rounded">
              <Text className="text-red-800">{errorMessage}</Text>
              <TouchableOpacity
                onPress={() => setIsErrorModalVisible(false)}
                className="mt-4"
              >
                <View className="bg-transparent border border-red-500 py-2 px-4 rounded">
                  <Text className="text-red-500 font-semibold">Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {isLoading && 
          <AnimatedLoader
            visible={isLoading}
            overlayColor="rgba(255,255,255,0.9)"
            source={require("../../assets/loader1.json")}
            animationStyle={{ width: 100, height: 100 }}
            speed={1}
          >
            <Text className="text-lg font-bold text-yellow-500 mb-6">Oceans hold 97% water.</Text>
          </AnimatedLoader>
          }

        </View>
      )}
    </Formik>
  );
};

export default LoginScreen;
