import { Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image, Linking } from "react-native";
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
                <Text style={styles.date}>30 Luglio 2025</Text>
                
                <Text style={styles.sectionTitle}>Introduzione</Text>
                <Text style={styles.paragraph}>
                    {"Guardia Monitor è un'applicazione mobile open source sotto licenza GPLv3 fornita da Guardia Digitale Srl (il cui codice sorgente è disponibile al seguente link: "}
                    <Text 
                        style={{color: '#28338a', letterSpacing: 0.3, textDecorationLine: 'underline'}}
                        onPress={() => Linking.openURL('https://github.com/GuardiaDigitale/Guardia-Monitor')}>
                        https://github.com/GuardiaDigitale/Guardia-Monitor
                    </Text>
                    {") per aiutare gli utenti a monitorare la propria sicurezza digitale mediante l'utilizzo di uno strumento semplice, intuitivo e trasparente. In un panorama di minacce informatiche in continua evoluzione, l'app si pone come un primo punto di contatto e di consapevolezza, consentendo agli utenti di verificare in modo proattivo le potenziali compromissioni dei loro dati personali."}
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
                    L'app non raccoglie dati personali degli utenti, ad eccezione dei dati forniti volontariamente dall’utente tramite inserimento dell’indirizzo e-mail. In tal caso, i dati saranno utilizzati esclusivamente per rispondere alle richieste degli utenti e non saranno condivisi con terze parti senza consenso.
                </Text>
                
                <Text style={styles.sectionTitle}>Legge applicabile</Text>
                <Text style={styles.paragraph}>
                    I termini e le condizioni d'uso sono regolati dalla legge italiana e qualsiasi controversia sarà di competenza esclusiva del foro di Firenze.
                </Text>

                <Text style={styles.sectionTitle}>Informativa sulla privacy</Text>
                <Text style={styles.paragraph}>
                    Guardia Monitor garantisce la non persistenza delle informazioni inserite, quali l'indirizzo e-mail e i risultati mostrati a seguito dell'aggiunta/della conferma del codice fornito dall'app stessa.
                </Text>

                <Text style={styles.subSectionTitle}>Richiesta di consulenza</Text>
                <Text style={styles.paragraph}>
                    Se contatti Guardia Monitor mediante l'invio di un'e-mail automatica, tutti i dati personali che condividi con noi vengono conservati solo allo scopo di esaminare il problema e contattarti per soddisfare la tua richiesta.
                </Text>

                <Text style={styles.subSectionTitle}>Aggiornamenti</Text>
                <Text style={styles.paragraph}>
                    Aggiorneremo la presente informativa sulla privacy secondo necessità, in modo che sia attuale, accurata e il più chiara possibile. L'uso continuato dei nostri servizi conferma l'accettazione della nostra Informativa sulla privacy aggiornata.
                </Text>

                <Text style={styles.subSectionTitle}>Termini</Text>
                <Text style={styles.paragraph}>
                    Si prega di leggere anche i nostri Termini che regolano anche i termini della presente Informativa sulla privacy.
                </Text>

                <Text style={styles.subSectionTitle}>Contattaci</Text>
                <Text style={styles.paragraph}>
                    In caso di domande sulla nostra Informativa sulla privacy, contattaci all'indirizzo{` `}
                    <Text 
                        style={{color: '#28338a', letterSpacing: 0.3, textDecorationLine: 'underline'}}
                        onPress={() => Linking.openURL('mailto:privacy@guardiadigitale.it')}>
                        privacy@guardiadigitale.it
                    </Text>
                    {`
All'attenzione di: Guardia Digitale Srl, Piazza Madonna della Neve, 5 - 50122 FIRENZE (ITALIA)`}
                </Text>
                
                <Text style={styles.effectiveDate}>
                    In vigore dal 30 luglio 2025
                    {'\n'}Aggiornato il 30 luglio 2025
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
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28338a',
        marginBottom: 5,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28338a',
        marginTop: 15,
        marginBottom: 10,
    },
    subSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#28338a',
        marginTop: 12,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.1,
        color: '#333',
        marginBottom: 12,
        textAlign: 'justify',
    },
    effectiveDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
});
