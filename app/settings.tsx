import { supabase } from "@/db/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Settings({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }
            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        username,
        website,
        avatar_url,
    }: {
        username: string
        website: string
        avatar_url: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')
            const updates = {
                id: session?.user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            }
            const { error } = await supabase.from('profiles').upsert(updates)
            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <TextInput
                    mode="outlined"
                    label="email"
                    value={session?.user.email || ''}
                    disabled={true}
                    style={{ marginBottom: 10 }}
                />
                <TextInput
                    mode="outlined"
                    label="username"
                    value={username}
                    onChangeText={(name) => { setUsername(name) }}
                    style={{ marginBottom: 10 }}
                />
                <TextInput
                    mode="outlined"
                    label="website"
                    value={website}
                    onChangeText={(web) => { setWebsite(web) }}
                    style={{ marginBottom: 10 }}
                />

                <Button
                    mode="contained"
                    onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
                    disabled={loading}
                    style={{ marginTop: 10 }}
                >

                    <Text style={{ marginTop: 10, textAlign: 'center' }}>
                        {loading ? 'Loading...' : 'Update Profile'}
                    </Text>

                </Button>

                <Button
                    mode="contained"
                    onPress={() => {
                        supabase.auth.signOut()
                    }}
                    disabled={loading}
                    style={{ marginTop: 10 }}
                >

                    <Text style={{ marginTop: 10, textAlign: 'center' }}>
                        {loading ? 'Loading...' : 'Sign Out'}
                    </Text>

                </Button>

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