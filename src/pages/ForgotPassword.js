import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import Modal from "react-native-modal";
import { sendPasswordResetEmail } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Formik } from "formik";
import * as yup from "yup";
import AnimatedLoader from "react-native-animated-loader";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = (values) => {
    setIsLoading(true);
    sendPasswordResetEmail(auth, values.email)
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
        setIsSuccessModalVisible(true);
        }, 1000);
      })
      .catch((error) => {
        
        if(error.code === "auth/user-not-found") {
            setErrorMessage("User not found. Please check your email.");
        } else 
        setErrorMessage("Failed to send password reset email.");
        setTimeout(() => {
          setIsLoading(false);
        setIsErrorModalVisible(true);
        }, 1000);
      });
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={handleForgotPassword}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-2xl font-bold mb-6">Forgot Password</Text>
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

          <TouchableOpacity
            className="w-64 h-10 bg-blue-500 rounded justify-center items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-semibold">Reset Password</Text>
          </TouchableOpacity>

          <View className="mt-4">
            <Text className="text-gray-600">
              Remember your password?{" "}
              <Text
                className="text-blue-600 active:text-blue-300"
                onPress={goToLogin}
              >
                Log in
              </Text>
            </Text>
          </View>

          <Modal
            isVisible={isSuccessModalVisible}
            onRequestClose={() => setIsSuccessModalVisible(false)}
            className="items-center -mb-96"
          >
            <View className="w-64 items-center p-4 bg-green-200 rounded">
              <Text className="text-green-800">Password reset email sent. Check your inbox.</Text>
              <TouchableOpacity
                onPress={() => setIsSuccessModalVisible(false)}
                className="mt-4"
              >
                <View className="bg-transparent border border-green-500 py-2 px-4 rounded">
                  <Text className="text-green-500 font-semibold">Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

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
          { isLoading &&
          <AnimatedLoader
            visible={isLoading}
            overlayColor="rgba(255,255,255,0.9)"
            source={require("../../assets/loader1.json")}
            animationStyle={{ width: 100, height: 100 }}
            speed={1}
          >
            <Text className="text-green-700 font-bold text-lg">Great Wall is visible.</Text>
          </AnimatedLoader>
          }
        </View>
      )}
    </Formik>
  );
};

export default ForgotPasswordScreen;
