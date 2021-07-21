# AppAcordate

Acordate! Es una pagina web que podes usar para anotar esas cosas que no tenes que olvidar :). Tambien es mi primer proyecto extra-universitario de desarrollo.

Utilice Firebase para el back-end, precisamente Firestore como DB y Firebase Authentication para los registros. En lo que al front-end respecta es HTML5, CSS3 y JS con uso de Arrow Functions, promesas y etc.

El uso es sencillo:
  1. Te registras
  2. Inicias sesion
  3. Guardas una nota de lo que tenes que acordarte
  4. No te olvidas mas!

El sitio esta en version alfa, tiene errores.

Si al ingresar al link podes ver el boton de cerrar sesion, hace lo siguiente:

  1. Cerra sesion (aunque no hayas ingresado)
  2. Refresca la pagina
  3. Inicia sesion

------

Errores a corregir:

  Wrong password login doesn't return an error.
  User sessions are handled by the app and not by the client/session itself.
  Sometimes the UI breaks (a component is randomly displayed in a wrong way) and that makes the user have to refresh the site, sign out and sign in again.
  
To do:

  Fix errors
  Make PWA
  Make Mobile app (maybe with reactJS or dart @ flutter)
  Add features:
    1. Custom color theme
    2. Save an image (maybe for this I should use another back-end and not firestore)
    3. Share your notes as a link
    
Link: https://acordate-app.web.app/
    
    
