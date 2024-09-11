import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicializar Firebase Admin SDK
admin.initializeApp();

// Função HTTP para buscar os dados do usuário
export const getUserMetadata = functions.https.onRequest(async (req, res) => {
  const {userId} = req.query;

  // Verifica se o userId foi passado
  if (!userId) {
    res.status(400).send("Faltando o parâmetro userId.");
    return;
  }

  try {
    // Busca os dados do usuário pelo userId
    const userRecord = await admin.auth().getUser(userId as string);
    const {lastSignInTime, creationTime} = userRecord.metadata;

    // Envia a resposta com as informações
    res.status(200).json({lastSignInTime, creationTime});
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).send("Erro ao buscar dados do usuário.");
  }
});
