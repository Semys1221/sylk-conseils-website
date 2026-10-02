# Debug — Message de fin Daily.co

Le message de fin après avoir cliqué sur "Quitter l'appel" est géré via un **écran React custom** dans `meeting-room.tsx`.

### Fonctionnement

1. L'événement `"left-meeting"` de Daily.co est écouté (ligne 81)
2. Un state `callEnded` passe à `true`
3. L'iframe Daily.co est remplacée par un écran custom React (lignes 112-125)

### Texte affiché

- "Merci pour votre visite."
- "Bonne journée !!!"
- "Vous pouvez fermer cette page."

### Notes

- `setCustomMessage()` n'existe pas dans l'API Daily.co — ne pas utiliser.
- La solution React est plus fiable et donne le contrôle total sur le message.
- La barre `CalModal` + toggle plein écran reste visible tant que l'appel est actif.
