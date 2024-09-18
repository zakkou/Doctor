# Import des bibliothèques nécessaires

from typing import List
from langchain_community.llms import CTransformers
from huggingface_hub import hf_hub_download

# Définition du dépôt modèle et du nom de fichier
MODEL_REPO = "TheBloke/Llama-2-7B-Chat-GGML"
MODEL_FILENAME = "llama-2-7b-chat.ggmlv3.q8_0.bin"

# Téléchargement du modèle à l'aide de l'API Hugging Face
model_path = hf_hub_download(repo_id=MODEL_REPO, filename=MODEL_FILENAME)

# Configuration du modèle
LLAMA2_MODEL_CONFIG = {
    "max_new_tokens": 100,  # Limiter la taille de la réponse pour des résultats plus rapides
    "temperature": 0.5,     # Ajuster la température pour plus de créativité
}

# Fonction pour prédire la maladie et recommander des médicaments
def predict_disease_and_recommend_medication(symptoms: List[str]) -> str:
    llm = CTransformers(model=model_path, model_type='llama', config=LLAMA2_MODEL_CONFIG)

    # Prompt ajusté pour que le modèle ne génère que du texte médical pertinent
    template = f"""
        Vous êtes un assistant médical. Lorsque des symptômes sont fournis, prédisez la maladie la plus probable
        et recommandez trois médicaments couramment utilisés pour cette maladie. Répondez uniquement par des informations médicales
        sans générer du code ou du texte non médical.

        Voici les symptômes : {', '.join(symptoms)}.
        Quelle est la maladie la plus probable et quels sont trois médicaments couramment utilisés pour traiter cette maladie ?

        Répondez uniquement en français avec des informations médicales précises.
    """

    # Utilisation du modèle pour générer la réponse
    print("En train d'invoquer le modèle avec le prompt...")
    response = llm.invoke(template)

    # Afficher la réponse brute pour vérifier ce qui est généré
    print("Réponse brute du modèle :")
    print(response)

    return response

# Entrée des symptômes par l'utilisateur