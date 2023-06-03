import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./Profile"; // Replace with the actual path to your ProfileScreen component
import { auth } from "../../firebase";
import Post from "./Post";
import Posts from "./Posts";
import { useIsFocused } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    function fetchData() {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconComponent;
          let iconName;
          let iconColor = focused ? "blue" : "gray";

          if (route.name === "Tab1") {
            iconName = "plus-box";
          } else if (route.name === "Tab2") {
            iconName = "home";
          } else if (route.name === "Tab3") {
            if (currentUser && currentUser.photoURL) {
              iconComponent = (
                <View
                  style={{
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? "blue" : "gray",
                    borderRadius: 34 / 2,
                    padding: focused ? 1 : 0,
                  }}
                >
                  <Image
                    source={{ uri: currentUser.photoURL }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 30 / 2,
                    }}
                  />
                </View>
              );
            } else {
              iconName = "account-circle";
            }
          }

          if (iconComponent) {
            return iconComponent;
          }

          return <Icon name={iconName} size={30} color={iconColor} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
        tabBarLabelStyle: { fontSize: 0, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "blue" },
      })}
    >
      <Tab.Screen
        name="Tab1"
        component={Tab1Screen}
        options={{ tabBarLabel: "Post" }}
      />
      <Tab.Screen
        name="Tab2"
        component={Tab2Screen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen name="Tab3" options={{ tabBarLabel: "Profile" }}>
        {() => <Tab3Screen currentUser={currentUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const Tab1Screen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Post />
    </View>
  );
};

const Tab2Screen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Posts />
    </View>
  );
};

const Tab3Screen = ({ currentUser }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ProfileScreen currentUser={currentUser} />
    </View>
  );
};

export default HomeScreen;
