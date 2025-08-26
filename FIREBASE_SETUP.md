# Firebase Setup for Campus Crush - University of Moratuwa

## 🔥 Setting Up Firebase Authentication for UOM Students

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "campus-crush")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

### 4. Get Your Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname
6. Copy the configuration object

### 5. Update Firebase Config

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};
```

### 6. Set Up Security Rules (Optional)

In Firestore Database > Rules, you can set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Test Your Setup

1. Start your development server: `npm start`
2. Navigate to `/signup` to test account creation
3. Check Firebase Console to see if users are created
4. Test email verification flow

**Note:** The app is configured to only accept University of Moratuwa email addresses (@uom.lk domain)

## 🚨 Important Notes

- **Never commit your actual Firebase config to version control**
- **Use environment variables for production**
- **Test authentication thoroughly before deployment**
- **Monitor Firebase usage and costs**

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**

   - Check your API key in the config
   - Ensure the key is correct and not truncated

2. **"Firebase: Error (auth/operation-not-allowed)"**

   - Enable Email/Password authentication in Firebase Console
   - Check if your project is properly configured

3. **"Firebase: Error (auth/network-request-failed)"**

   - Check your internet connection
   - Verify Firebase project is active

4. **Users not appearing in Firestore**
   - Check Firestore security rules
   - Ensure Firestore is enabled in your project

## 📱 Next Steps

After setting up Firebase:

1. Test the complete authentication flow
2. Set up email templates in Firebase Console
3. Configure custom domains if needed
4. Set up analytics and monitoring
5. Plan for production deployment

## 🆘 Support

If you encounter issues:

1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Review Firebase Console for error logs
3. Check browser console for detailed error messages
4. Verify all configuration values are correct
