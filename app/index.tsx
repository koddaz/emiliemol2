import { supabase } from "@/db/supabase";
import { AppState, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, PaperProvider, TextInput } from 'react-native-paper';
import { useState } from "react";

export default function Index() {
  return (
    <PaperProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       <AuthScreen />
      </SafeAreaView>
    </PaperProvider>
  );
}


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

interface AuthProps {
  user_name?: string;
  user_password?: string;
  user_email?: string;
}

export function AuthScreen(
  props: AuthProps
) {

  return (
    <View style={styles.background}>
      <Auth {...props} />
    </View>
  )

}

export function Auth(
  props: AuthProps
) {

  return (
    <View style={styles.container}>
      <Text>Auth Component</Text>
      <AuthInput {...props} />
      <AuthButtons {...props} />
    </View>
  )

}

export function AuthInput(
  props: AuthProps
) {
  const { user_email, user_name, user_password } = props;
  var [email, setEmail] = useState(user_email || '');
  var [username, setUsername] = useState(user_name || '');
  var [password, setPassword] = useState(user_password || '');

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 10 }}>
        Auth Input Component
      </Text>

      <TextInput
        label="email"
        value={email}
        onChangeText={(text) => { setEmail(text) }}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="username"
        value={username}
        onChangeText={(text) => { setUsername(text) }}
        style={{ marginBottom: 10 }}
      />

      <TextInput
        label="password"
        value={password}
        onChangeText={(text) => { setPassword(text) }}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />

    </View>
  )
}

export function AuthButtons(
  props: AuthProps
) {

  const [toggle, setToggle] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          console.log('Sign In Pressed');
          // Call signIn function here
        }}
        style={{ marginBottom: 10 }}
      >

        {toggle ? 'Sign Up' : 'Sign In'}

      </Button>
      <View style={styles.row}>
            {toggle ? (
              <Text>Don't have an account? Create an account</Text>
            ) : (
              <Text>Already have an account? Sign in</Text>
            )}
            <Text style={{ color: 'blue' }} onPress={() => {
              console.log('Sign Up Pressed');
              setToggle(!toggle)
            }}>
              HERE
            </Text>
            
          </View>
        </View>
      );
}



      export function AuthState() {
  const [session, setSession] = useState(supabase.auth.getSession());

  const signIn = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });
      if (error) {
        console.error('Sign in error:', error);
    } else {
        // setSession(data.session);
      }
  }

  const signUp = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
    });
      if (error) {
        console.error('Sign up error:', error);
    } else {
        // setSession(data.session);
      }
  }
}

      export const styles = StyleSheet.create({

        background: {
        width: '100%',
      flex: 1,
  },
      container: {
        width: '100%',
      borderWidth: 1,
      padding: 10,
  },
      row: {
        flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
      column: {
        flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
  }


})