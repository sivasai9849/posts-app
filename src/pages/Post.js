import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
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
import { ProgressBar } from "react-native-paper";

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted!");
    }
  };

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // 4:4 aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    
    try {
      if (!title && !content) {
        console.log("Please provide a title and content for the post.");
        return;
      }
      else
      // Create a new post object
      setShowModal(true);
      const newPost = {
        title: title,
        content: content,
        userId: user.uid,
        timestamp: Date.now(),

      };

      // Add the new post to Firestore
      const postCollectionRef = collection(db, "posts");
      const newPostRef = await addDoc(postCollectionRef, newPost);

      // Upload image to Firebase Storage if an image is selected
      if (imageUri) {
        const storage = getStorage();
        const storageRef = ref(storage, `posts/${newPostRef.id}/image.jpg`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
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
          async () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setDoc(newPostRef, { image: downloadURL }, { merge: true });
              setUploadProgress(null);
              console.log("Post created successfully!");
              setTitle("");
              setContent("");
              setImageUri("");
              setShowModal(false);
            });
          }
        );

        // Get the download URL of the uploaded image
      }
      else {
        console.log("Post created successfully!");
        setTitle("");
        setContent("");
        setImageUri("");
        setShowModal(false);
      }

    } catch (error) {
      console.log("Error creating post:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Create Post</Text>

          <TextInput
            className="w-80 h-10 p-2 mb-4 border border-gray-300 rounded"
            placeholder="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />

          <TextInput
            className="w-full h-20 p-2 mb-4 border border-gray-300 rounded"
            placeholder="Content"
            multiline
            value={content}
            onChangeText={(text) => setContent(text)}
          />

          <TouchableOpacity
            className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4"
            onPress={handleImageSelection}
          >
            <Icon name="image" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {imageUri ? (
          <View className="bg-white mb-2 border-gray-300">
            <View className="p-4">
              <Image
                className="w-80 h-80 mb-4 rounded"
                source={{ uri: imageUri }}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          className="bg-blue-500 rounded-md py-2 px-6 ml-64 mb-4 self-start"
          onPress={handlePost}
        >
          <Text className="text-white">Post</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View
            className="flex-1 justify-center items-center bg-black bg-opacity-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <View className="bg-white p-4 rounded-md">
              <Text className="text-lg  ml-4 text-cyan-700 font-bold mb-2">
                You light up everything.
              </Text>

              <ProgressBar progress={uploadProgress} color={"cyan"} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default Post;
