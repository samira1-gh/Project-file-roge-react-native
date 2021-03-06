import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { React, useState } from "react";
import { Colors } from "../../../componentes/generel/contants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import style from "./style";
import { login } from "../../../services/Auth";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  loginAction,
  setRoleAction,
  setIdAction,
  setEmail,
  setUsername,
} from "../../../store/actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
// import {PrimaryButton } from "../../../componentes/generel/button/button";

export default function Login({ navigation }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const Role = useSelector((state) => state.email);
  console.log(Role);

  const handelSubmit = async () => {
    login(user.email, user.password).then((response) => {
      (async () => {
        await dispatch(loginAction(jwtDecode(response.data.accessToken)));
        await dispatch(
          setRoleAction(jwtDecode(response.data.accessToken).role)
        );
        await dispatch(setIdAction(jwtDecode(response.data.accessToken).id));
        await dispatch(setEmail(jwtDecode(response.data.accessToken).email));
        await dispatch(
          setUsername(jwtDecode(response.data.accessToken).username)
        );

        const Token = await AsyncStorage.setItem(
          "token",
          response.data.accessToken
        );
        await navigation.navigate("Profile");
        console.log(jwtDecode(response.data.accessToken).email);
      })();
      setSubmitted(true);
    });
  };

  return (
    <View style={style.container}>
      <View style={style.header}>
        <ImageBackground
          style={{ height: "100%", width: "100%", position: "absolute" }}
          source={require("../../../../assets/t??l??chargement.jpg")}
        />
        <Text style={[style.text_header, { marginBottom: 80 }]}>Welcome!</Text>
      </View>
      <View style={style.footer}>
        <Text style={style.text_footer}>Email</Text>
        <View style={style.action}>
          <FontAwesome name="envelope" size={20} />
          <TextInput
            placeholder="Your Email"
            onChangeText={(email) => setUser({ ...user, email: email })}
            placeholderTextColor="#666666"
            style={[
              style.textInput,
              {
                color: Colors.text,
              },
            ]}
          />
        </View>
        <Text style={[style.text_footer, { marginTop: 30 }]}>Password</Text>
        <View style={style.action}>
          <FontAwesome name="lock" size={20} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666666"
            onChangeText={(password) =>
              setUser({ ...user, password: password })
            }
            style={[
              style.textInput,
              {
                color: Colors.text,
              },
            ]}
          />
        </View>
        <TouchableOpacity style={style.button} onPress={handelSubmit}>
          <LinearGradient colors={["#596C30", "#29553D"]} style={style.signIn}>
            <Text
              style={[
                style.textSign,
                {
                  color: "#fff",
                },
              ]}
            >
              Sign In
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
