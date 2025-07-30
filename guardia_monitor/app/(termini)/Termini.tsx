import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

export default function Terms() {
    const router = useRouter();
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ 
                headerShown: true, 
                headerStyle: {
                    backgroundColor: '#28338a',
                }, 
                title: 'Termini e Condizioni', 
                headerLeft: () => (
                    <TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => navigation.openDrawer()}>
                      <Ionicons name="menu" size={30} color="#dbe7f2" />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push('/')}>
                       <Ionicons name="home" size={24} style={{marginRight: 10}} color="#dbe7f2" />
                    </TouchableOpacity>
                ), 
                headerTitleStyle: {
                    color: '#dbe7f2',
                    fontWeight: '600',
                }, 
            }} />
            
            <ScrollView style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../assets/images/logoAppBlue.png')} style={styles.logo} />
                </View>
                <Text style={styles.title}>Termini e Condizioni</Text>
                <Text style={styles.date}>11 Luglio 2025</Text>
                
                <Text style={styles.sectionTitle}>Introduzione</Text>
                <Text style={styles.paragraph}>
                    Guardia Monitor è un'applicazione mobile fornita da Guardia Digitale Srl per aiutare gli utenti a monitorare la propria sicurezza digitale mediante l'utilizzo di uno strumento semplice, intuitivo e trasparente. In un panorama di minacce informatiche in continua evoluzione, l'app si pone come un primo punto di contatto e di consapevolezza, consentendo agli utenti di verificare in modo proattivo le potenziali compromissioni dei loro dati personali.
                </Text>
                
                <Text style={styles.sectionTitle}>Proprietà intellettuale</Text>
                <Text style={styles.paragraph}>
                    L'app e tutti i suoi contenuti, inclusi testi, immagini e grafiche, sono di proprietà esclusiva di Guardia Digitale Srl e sono protetti dalle leggi sul copyright.
                </Text>
                
                <Text style={styles.sectionTitle}>Limitazioni di responsabilità</Text>
                <Text style={styles.paragraph}>
                    L'app è destinata esclusivamente a scopi informativi. L'utente è responsabile dell'interpretazione dei risultati relativi alla compromissione dei dati personali e Guardia Digitale Srl non si assume alcuna responsabilità per eventuali decisioni prese sulla base di tali risultati.
                </Text>
                
                <Text style={styles.sectionTitle}>Privacy</Text>
                <Text style={styles.paragraph}>
                    L'app non raccoglie dati personali degli utenti, ad eccezione dei dati forniti volontariamente dall'utente tramite inserimento dell'indirizzo e-mail. In tal caso, i dati saranno utilizzati esclusivamente per rispondere alle richieste degli utenti e non saranno condivisi con terze parti senza consenso.
                </Text>
                
                <Text style={styles.sectionTitle}>Legge applicabile</Text>
                <Text style={styles.paragraph}>
                    I termini e le condizioni d'uso sono regolati dalla legge italiana e qualsiasi controversia sarà di competenza esclusiva del foro di Firenze.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dbe7f2',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#043474',
        marginBottom: 20,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28338a',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 12,
        textAlign: 'justify',
    },
});
