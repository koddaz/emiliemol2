import { supabase } from "@/db/supabase";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { StyleSheet, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper";

export default function DiaryScreen({ session }: { session: Session }) {

    var userId = session?.user.id;

    return (
        <View style={styles.background}>
            <DiaryInput userId={userId} />
        </View>
    )

}

export function DiaryInput(
    { userId }: { userId: string }
) {
    const [entry, setEntry] = useState('');

    // Function to handle diary entry submission
    async function handleSubmit() {
        try {
            // Get the user's diary folder ID using Supabase client
            const { data: folderData, error: folderError } = await supabase
                .from('diary')
                .select('id')
                .eq('user_id', userId)
                .eq('folder_type', 'diary')
                .single();

            if (folderError) {
                throw folderError;
            }

            if (!folderData) {
                throw new Error('Diary folder not found');
            }

            // Insert the diary entry using Supabase client
            const { error: insertError } = await supabase
                .from('diary_entries')
                .insert({
                    user_id: userId,
                    folder_id: folderData.id,
                    content: entry
                });

            if (insertError) {
                throw insertError;
            }

            setEntry(''); // Clear the input field after submission
            console.log('Diary entry submitted successfully!');

        } catch (error) {
            console.error("Error submitting diary entry:", error);
        }
    }


    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                label="Diary Entry"
                multiline={true}
                value={entry}
                onChangeText={(text) => setEntry(text)}
                numberOfLines={4}
                style={{ marginBottom: 10 }}
            />
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ marginTop: 10 }}
            >
                <Text style={{ textAlign: 'center' }}>Submit Entry</Text>
            </Button>
        </View>
    );
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