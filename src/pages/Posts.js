import React, { useState, useEffect } from "react";
import { View, Text, Image,TouchableOpacity,Modal } from "react-native";
import { FlatList } from "react-native";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  
  onSnapshot,
  query,
 
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useIsFocused } from "@react-navigation/native";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  //const user1 =  auth.getUser("Mgj6IINJiEXWukWJAjSFjfLB0Lp1");
  
  
  
  
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts")),
      (snapshot) => {
        const updatedPosts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(updatedPosts);      
      }
    );
    const unsubscribeAuth = auth.onAuthStateChanged((updatedUser) => {
      setUser(updatedUser);
    });

    return () => {
      // Unsubscribe from the snapshot listener and auth state change listener when the component is unmounted
      unsubscribe();
      unsubscribeAuth();
    };
  }, [isFocused]);

  useEffect(() => {
    const unsubscribeUser = onSnapshot(
      query(collection(db, "users")),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(users);
       
      }
    );

    return () => {
      // Unsubscribe from the snapshot listener and auth state change listener when the component is unmounted
      unsubscribeUser();
    };
  }, [isFocused]);


  const openPostPreview = (image) => {
    setPreviewImage(image);
    setShowModal(true);
  };

  const renderPost = ({ item }) => {
    const getUsername = (userId) => {
      const user1 = users ? users.find((user) => user.id === userId) : null;
      if ((user1 && user1.fullName) === (user && user.displayName)) {
        return "You";
      } else return user1 ? user1.fullName : "User";
    };
    const getProfile = (userId) => {
      const user1 = users ? users.find((user) => user.id === userId) : null;
      if ((user1 && user1.photoURL) === (user && user.photoURL)) {
        return user.photoURL;
      } else return user1 ? user1.photoURL : null;
    };


    

  
    const username = users ? getUsername(item.userId) : "";
    const profilePicture = users ? getProfile(item.userId) : null;

    return (
      
      <View key={item.id} className="overflow-hidden bg-white mb-4">
        <View className="flex-row p-2 ">
          <Image
            source={{
              uri:
              (user && profilePicture) ||
                "https://www.w3schools.com/howto/img_avatar.png",
            }}
            className="w-10 h-10 rounded-full mr-4"
          />
          <Text className="text-lg font-bold mt-1">{username}</Text>
        </View>
        <TouchableOpacity onPress={() => openPostPreview(item.image)}>
        {item.image && (
          <Image source={{ uri: item.image }} className="w-full h-80" />
        )}
        </TouchableOpacity>
        <View className="p-4">
          <Text className="text-lg font-bold mb-2">{item.title}</Text>
          <Text className="text-gray-500">{item.content}</Text>
        </View>
      </View>
      
    );
  };

  return (
    <View className="flex-1 w-full bg-gray-200">
      <FlatList
        data={posts}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />
       <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Image
              source={{ uri: previewImage }}
              className="h-96 w-96"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Posts;
