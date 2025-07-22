const IS_DEV = true;
const IS_PROD = process.env.APP_VARIANT === "production";

const getAppName = () => {
  if (IS_PROD) {
    return "Guardia Monitor";
  }
  if (IS_DEV) {
    return "Guardia Monitor";
  }
};

const getSlug = () => {
  if (IS_PROD) {
    return "guardia-monitor";
  }
  if (IS_DEV) {
    return "guardia-monitor";
  }
};

const getScheme = () => {
  if (IS_PROD) {
    return "guardia-monitor";
  }
  if (IS_DEV) {
    return "guardia-monitor";
  }
};

const getBundleIdentifier = () => {
  if (IS_PROD) {
    return "com.unirex.guardia-monitor";
  }
  if (IS_DEV) {
    return "com.unirex.guardia-monitor-dev";
  }
};

const getProjectId = () => {
  if (IS_PROD) {
    return "0fe898f8-caf7-4a0a-8e31-83dba844cee9";
  }
  if (IS_DEV) {
    return "0fe898f8-caf7-4a0a-8e31-83dba844cee9";
  }
};

const getAPIUrl = () => {
  let URI = "http://192.168.1.100:3000";
  if (IS_PROD) {
    return "https://guardiadigitale.it/";
  }
  if (IS_DEV) {
    return URI;
  }
};

const getEnvironment = () => {
  if (IS_PROD) {
    return "production";
  }
  if (IS_DEV) {
    return "development";
  }
};

export default ({ config }) => {
  return {
    ...config,
    name: getAppName(),
    slug: getSlug(),
    owner: "unirex",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logoApp.png",
    scheme: getScheme(),
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/GD.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      imageWidth: 200
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: getBundleIdentifier(),
      buildNumber: "1",
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleDevelopmentRegion: "it"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logoApp.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["VIBRATE"],
      package: getBundleIdentifier(),
      versionCode: 7,
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/GD.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: getProjectId(),
      },
      apiUrl: getAPIUrl(),
      environment: getEnvironment(),
    },
  };
};