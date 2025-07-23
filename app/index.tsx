import { supabase } from "@/db/supabase";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, PaperProvider, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto';
import Settings from "./settings";
import DiaryScreen from "./diary";

export default function Index() {

  const [session, setSession] = useState<Session | null>(null)


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  // If no session, show auth screen
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {session && session.user ? 
          <DiaryScreen key={session.user.id} session={session} /> : <AuthScreen />}
      </SafeAreaView>
    </PaperProvider>
  );
}



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
      <AuthInput {...props} />
    </View>
  )

}



export function AuthInput(
  props: AuthProps
) {

  var [email, setEmail] = useState(props.user_email || '');
  // var [username, setUsername] = useState(props.user_name || '');
  var [password, setPassword] = useState(props.user_password || '');
  var [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState(false)


  async function signInWithEmail() {
    console.log('Starting sign in...')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      console.log('Sign in response:', { error })

      if (error) {
        console.error('Sign in error:', error)
        Alert.alert(error.message)
      }
    } catch (err) {
      console.error('Sign in exception:', err)
    } finally {
      console.log('Sign in complete')
      setLoading(false)
    }
  }

  async function signUpWithEmail() {
    console.log('Starting sign up...')
    setLoading(true)

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      console.log('Sign up response:', { session, error })

      if (error) {
        console.error('Sign up error:', error)
        Alert.alert(error.message)
      }
      if (!session) {
        Alert.alert('Please check your inbox for email verification!')
      }
    } catch (err) {
      console.error('Sign up exception:', err)
    } finally {
      console.log('Sign up complete')
      setLoading(false)
    }
  }


  // Lägg till funktioner för att hantera inloggning och registrering. 
  // Logik om att texten måste innehålla saker och att lösenordet är rätt formaterat.
  // Skapa felmeddelanden om inloggning eller registrering misslyckas.
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

      {/* <TextInput
        label="username"
        value={username}
        onChangeText={(text) => { setUsername(text) }}
        style={{ marginBottom: 10 }}
      /> */}

      <TextInput
        label="password"
        value={password}
        onChangeText={(text) => { setPassword(text) }}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() => {
            console.log('Sign In Pressed');

            if (!loading) {
              if (toggle) {
                signUpWithEmail();
                console.log('Calling sign up');
              } else {
                signInWithEmail();
                console.log('Calling sign in');
              }
            }
          }}
          style={{ marginBottom: 10 }}
          loading={loading}
        >
          {toggle ? 'Sign Up' : 'Sign In'}

        </Button>
        <View style={styles.row}>
          {toggle ? (
            <Text>Already have an account? </Text>
          ) : (
            <Text>Don't have an account? </Text>
          )}
          <Text style={{ color: 'blue' }} onPress={() => {
            console.log('Toggle pressed');
            setToggle(!toggle)
          }}>
            {toggle ? 'Sign In' : 'Sign Up'}
          </Text>
        </View>
      </View>
    </View>
  )
}






const styles = StyleSheet.create({

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