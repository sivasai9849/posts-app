import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { auth } from "../../firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AnimatedLoader from "react-native-animated-loader";

const ProfileScreen = ({ currentUser }) => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [age, setAge] = useState("");
  const [showModalimage, setShowModalimage] = useState(false);
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const user = auth.currentUser;
  useEffect(() => {
    async function fetchData() {
      const user = auth.currentUser;
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPhoneNumber(data.phoneNumber || "");
        setAge(data.age || "");
        setLocation(data.location || "");
        setGender(data.gender || "");
      }
    }
    if (isFocused) {
      user && fetchData();

      setIsReady(true);
      setIsLoading(true);

      setTimeout(() => {
        setIsReady(false);
        setIsLoading(false);
      }, 1000);
    }
  }, [isFocused]);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleLogout = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    setIsLogout(true);
    auth
      .signOut()
      .then(() => {
        // Implement your logout logic here
        setTimeout(() => {
          setIsLogout(false);
          setShowModal(false);

          navigation.navigate("Login");
        }, 1000);
      })
      .catch((error) => {
        // An error occurred
        setShowModal(false);
        console.log(error);
      });
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  const handleImageClick = () => {
    setPreviewImage(user.photoURL);
    setShowModalimage(true);
  };

  return (
    <View className="flex">
      <View className="bg-white rounded-lg items-center px-4 py-6">
        <View className="bg-white px-24 py-6">
          <TouchableOpacity onPress={handleImageClick}>
            <Image
              source={{
                uri:
                  (user && user.photoURL) ||
                  "https://www.w3schools.com/howto/img_avatar.png",
              }}
              className="mb-2 rounded-full w-40 h-40"
            />
          </TouchableOpacity>
          <Text className="font-bold text-24 mb-2 text-center ">
            {(user && user.displayName) || ""}
          </Text>
          <Text className="text-gray-500  text-center items-center">
            {location}
          </Text>
        </View>
        <View className="bg-white px-7 py-6">
          {user && (
            <View className="flex flex-row items-center mb-4">
              <Text className="font-medium text-lg mr-2">Email:</Text>
              <Text className="text-gray-700">{user.email}</Text>
            </View>
          )}
          <View className="flex flex-row items-center mb-4">
            <Text className="font-medium text-lg mr-2">Phone:</Text>
            <Text className="text-gray-700">{phoneNumber || ""}</Text>
          </View>
          <View className="flex flex-row items-center mb-4">
            <Text className="font-medium text-lg mr-2">Age:</Text>
            <Text className="text-gray-700">{age || ""}</Text>
          </View>
          <View className="flex flex-row items-center mb-4">
            <Text className="font-medium text-lg mr-2">Gender:</Text>
            <Text className="text-gray-700">{gender || ""}</Text>
          </View>
        </View>
        <View className="flex-row">
          <View className="bg-white px-4 py-4 flex-row justify-between">
            <TouchableOpacity
              className="w-24 h-10 bg-blue-500 rounded justify-center items-center"
              onPress={handleEditProfile}
            >
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white px-4 py-4 flex-row justify-between">
            <TouchableOpacity
              className="w-24 h-10 bg-blue-500 rounded justify-center items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View
          className="flex-1 justify-center items-center  bg-opacity-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="rounded-lg p-6 shadow-lg  bg-white ">
            <Text className="text-lg font-semibold mb-2">Confirmation</Text>
            <Text className="mb-4">Are you sure you want to logout?</Text>
            <View className="flex flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-400 rounded px-4 py-2 mr-2"
                onPress={handleCancelLogout}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 rounded px-4 py-2"
                onPress={handleConfirmLogout}
              >
                <Text className="text-white">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModalimage}
        onRequestClose={() => setShowModalimage(false)}
      >
        <View
         style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        
        >
          <TouchableOpacity onPress={() => setShowModalimage(false)}>
            <Image
              source={{ uri: previewImage }}
              className=" h-80 w-80 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </Modal>
      {isReady && isLoading && (
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.9)"
          source={require("../../assets/loader1.json")}
          animationStyle={{ width: 100, height: 100 }}
          speed={1}
        >
          <Text className="text-lg font-bold text-blue-700">
            Eiffel Tower was temporary.
          </Text>
        </AnimatedLoader>
      )}
      { isLogout && <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.9)"
          source={require("../../assets/loader1.json")}
          animationStyle={{ width: 100, height: 100 }}
          speed={1}
        >
          <Text className="text-lg font-bold text-violet-700">Koalas sleep 20 hours.</Text>
        </AnimatedLoader>
      }
    </View>
  );
};

export default ProfileScreen;
