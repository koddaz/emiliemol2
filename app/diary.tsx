import { supabase } from "@/db/supabase";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Session } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

export default function DiaryScreen({ session }: { session: Session }) {

    var userId = session?.user.id;

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

    return (
        <GestureHandlerRootView style={styles.background}>

            <Button
                mode="contained"
                onPress={() => bottomSheetRef.current?.expand()}
                style={{ marginTop: 10 }}
            >
                <Text style={{ textAlign: 'center' }}>Open</Text>
            </Button>


            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <DiaryInput userId={userId} />
                </BottomSheetView>
            </BottomSheet>

        </GestureHandlerRootView>

    )

}

export function DiaryEntries() {
    // This component will fetch and display diary entries from the database   

    return (
        <View style={styles.background}>
            <Text>Diary Entries will be displayed here</Text>
            {/* Add your diary entries display logic here */}
        </View>
    );
}


export function DiaryInput(
    { userId }: { userId: string }
) {
    // State variables for diary entries
    const [entry, setEntry] = useState('');
    const [carbs, setCarbs] = useState('');
    const [insulin, setInsulin] = useState('');

    // State variable for the selected tab and bottom sheet
    const [tab, setTab] = useState('diary');


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
                    content: entry,
                    carbs: carbs,
                    insulin: insulin,
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
        <View style={styles.background}>
            <View style={styles.background}>
                <SegmentedButtons
                    theme={{
                        roundness: 0
                    }}
                    value={tab}
                    onValueChange={setTab}
                    style={{ marginBottom: 5 }}
                    buttons={[

                        {
                            icon: 'food',
                            value: 'carbs',
                            label: 'Carbs',
                        },
                        {
                            icon: 'camera',
                            value: 'photo',
                            label: 'Photo'
                        },
                        {
                            icon: 'note',
                            value: 'diary',
                            label: 'Notes',
                        },
                    ]}
                />


                {tab === 'diary' && (
                    <NoteInput
                        entry={entry}
                        setEntry={setEntry}
                    />
                )}

                {tab === 'carbs' && (
                    <CarbsInput
                        carbs={carbs}
                        setCarbs={setCarbs}
                        insulin={insulin}
                        setInsulin={setInsulin}
                    />
                )}

                {tab === 'photo' && (
                    <View style={{ marginBottom: 10 }}>
                        <Text>Photo functionality coming soon...</Text>
                        {/* Add your photo upload component here */}
                    </View>
                )}


            </View>

            <View style={{ marginTop: 10, }}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={{ marginTop: 10 }}
                >
                    <Text style={{ textAlign: 'center' }}>Submit Entry</Text>
                </Button>
            </View>
        </View>
    );
}


export function CarbsInput(
    {
        carbs, setCarbs,
        insulin, setInsulin
    }: {
        carbs?: string, setCarbs: (carbs: string) => void,
        insulin?: string, setInsulin: (insulin: string) => void
    }
) {
    return (
        <View style={{}}>
            <TextInput
                mode="outlined"
                label="Carbs"
                value={carbs}
                onChangeText={(text) => setCarbs(text)}
                keyboardType="numeric"
                style={{ marginBottom: 5 }}
            />
            <TextInput
                mode="outlined"
                label="Insulin"
                value={insulin}
                onChangeText={(text) => setInsulin(text)}
                keyboardType="numeric"
                style={{ marginBottom: 5 }}
            />
        </View>
    );

}

export function NoteInput(
    { entry, setEntry }: { entry: string, setEntry: (note: string) => void }
) {
    return (
        <TextInput
            mode="outlined"
            label="Diary Entry"
            multiline={true}
            value={entry}
            onChangeText={(text) => setEntry(text)}
            numberOfLines={4}
            style={{ marginBottom: 10 }}
        />
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

    contentContainer: {
        flex: 1,
        padding: 16,
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