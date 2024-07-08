import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ProgressBar, RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import AnimatedLoader from "react-native-animated-loader";

const { useNavigation } = require("@react-navigation/native");

const EditProfileScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control the progress modal
  const [uploadProgress, setUploadProgress] = useState(0); // State to store the upload progress
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchData() {
      setProfilePicture(user.photoURL);
      setEmail(user.email);
      setFullName(user.displayName);
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
    fetchData();
  }, [user]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSelectImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);

      const user = auth.currentUser;
      const storage = getStorage();
      const storageRef = ref(storage, `users/${user.uid}/profilePicture.jpg`);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(storageRef, blob);
      setShowModal(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setProfilePicture(downloadURL);
            setShowModal(false);
          });
          
        }
        
      );
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          fullName: fullName,
          gender: gender,
          phoneNumber: phoneNumber,
          age: age,
          location: location,
          photoURL: profilePicture,
        });
      } else {
        await setDoc(docRef, {
          fullName: fullName,
          email: email,
          gender: gender,
          phoneNumber: phoneNumber,
          age: age,
          location: location,
          photoURL: profilePicture,
        });
      }
      await updateProfile(user, {
        displayName: fullName,
        photoURL: profilePicture,
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="mt-8">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex mb-12 ">
          <Icon name="arrow-back" size={24} onPress={handleGoBack} />
          <Text className="text-lg -mt-7 ml-8 font-semibold">Edit Profile</Text>
        </View>
        <View className="bg-white     mt-8 p-4 ">
          <TouchableOpacity onPress={handleSelectImage}>
            <Image
              source={{
                uri:
                  profilePicture ||
                  "https://www.w3schools.com/howto/img_avatar.png",
              }}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 5,
              }}
            >
              <Icon name="edit" size={20} />
            </View>
          </TouchableOpacity>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            className="bg-gray-200 border border-gray-300 rounded py-2 px-4 mb-4"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            className="bg-white border border-gray-300 rounded py-2 text-black px-3 mb-4"
            readOnly
          />
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            className="bg-gray-200 border border-gray-300 rounded py-2 px-4 mb-4"
          />
          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={(text) => setAge(text)}
            className="bg-gray-200 border border-gray-300 rounded py-2 px-4 mb-4"
          />

          <View className="flex flex-row items-center mb-4">
            <Text className=" ">Gender</Text>
            <RadioButton
              value="Male"
              status={gender === "Male" ? "checked" : "unchecked"}
              onPress={() => setGender("Male")}
            />
            <Text className="text-gray-700 mr-4">Male</Text>
            <RadioButton
              value="Female"
              status={gender === "Female" ? "checked" : "unchecked"}
              onPress={() => setGender("Female")}
            />
            <Text className="text-gray-700">Female</Text>
          </View>
          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={(text) => setLocation(text)}
            className="bg-gray-200 border border-gray-300 rounded py-2 px-4 mb-4"
          />

          <TouchableOpacity
            onPress={handleSaveChanges}
            className="bg-blue-500 text-white rounded py-2 px-4"
          >
            <Text className="text-center text-white">Save Changes</Text>
          </TouchableOpacity>
          <Modal
            visible={showModal}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
          >
            <View
              className="flex-1 justify-center items-center  bg-opacity-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <View className="bg-white rounded-lg p-4 ">
                <Text className="text-lg font-semibold  mb-4">
                  Uploading...
                </Text>
                <ProgressBar
                  progress={uploadProgress}
                  color="green"
                  className="w-72"
                />
              </View>
            </View>
          </Modal>
          {isLoading && (
            <AnimatedLoader
              visible={isLoading}
              overlayColor="rgba(255,255,255,0.9)"
              source={require("../../assets/loader1.json")}
              animationStyle={{ width: 100, height: 100 }}
              speed={1}
            >
              <Text className=" text-lg font-bold text-red-600 mb-4">
                Ants work without supervision.
              </Text>
            </AnimatedLoader>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
