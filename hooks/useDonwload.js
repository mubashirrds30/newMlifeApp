import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid, Platform, Linking } from 'react-native';

const useDownload = () => {
  const handleDownload = async (link, attachmentName) => {
    const uniqueFileName = `${attachmentName}_${new Date().getTime()}.pdf`; // Ensure PDF extension

    const { dirs } = RNFetchBlob.fs;
    const directoryPath = dirs.DownloadDir;
    const filePath = `${directoryPath}/${uniqueFileName}`;

    console.log('Starting download...');

    // Request permissions on Android versions below 13
    if (Platform.OS === 'android' && Platform.Version < 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission denied');
          return;
        }
      } catch (err) {
        console.log('Permission request error:', err);
        return;
      }
    }

    const configOptions = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading file...',
        mime: 'application/pdf', // Set MIME type for PDF
        title: uniqueFileName,
        mediaScannable: true,
      },
    };

    try {
      console.log('Before fetch...', configOptions);

      const response = await RNFetchBlob.config(configOptions).fetch('GET', link);

      console.log('Download response status:', response.info().status);
      if (response.info().status === 200) {
        console.log('File downloaded successfully to:', filePath);

        // Open the file after download
        Linking.openURL(filePath).catch((err) => console.log('Error opening file:', err));
        return filePath;
      } else {
        console.log('Download failed with status:', response.info().status);
      }
    } catch (error) {
      console.log('Download error:', error);
    }
  };

  return [handleDownload];
};

export default useDownload;
